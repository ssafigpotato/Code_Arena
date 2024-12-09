import styled from "styled-components";
import useUserStore from "@/store/userstore";
import kurentoUtils, { WebRtcPeer } from "kurento-utils";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import ChatComponent from "./Chat";
import { domain } from "@/utils/api";
interface IParNickname {
  [user: string]: string;
}
var globalWebRtcPeers = {};
var isLeftEvent = false;
var isExistingEvent = false;
var NewParticipantId: string | null = null;

const GroupCall = () => {
  // 선언부
  const wsRef = useRef<any>(undefined);
  const { currentUser } = useUserStore();
  const localVideoRef = useRef(null);
  const [remoteVideos, setRemoteVideos] = useState({});
  const [participantNickname, setParticipantNickname] = useState({});
  const params = useParams<{ id: string }>();

  // useEffect 부
  useEffect(() => {
    if (NewParticipantId) {
      receiveVideoFromAfterPart(NewParticipantId);
      NewParticipantId = null;
    }
    if (!isLeftEvent && isExistingEvent) {
      Object.keys(remoteVideos).map((userId) => {
        receiveVideoFromAfterPart(userId);
      });
      isExistingEvent = false;
    }
    if (isLeftEvent) {
      isLeftEvent = false;
    }
    console.log(remoteVideos);
  }, [remoteVideos]);

  useEffect(() => {
    wsRef.current = new WebSocket("wss://" + domain + "/groupCall");
    wsRef.current.onopen = () => {
      wsRef.current.onmessage = (resp: any) => {
        var respMsg = JSON.parse(resp.data);

        if (
          respMsg.id != "iceCandidate" &&
          respMsg.id != "RECEIVE_VIDEO_ANSWER"
        ) {
          console.info("Received message: " + resp.data);
        }
        switch (respMsg.id) {
          case "EXIST_PARTICIPANT":
            onExistingParticipants(respMsg);
            break;
          case "NEW_PARTICIPANT_ARRIVED":
            onNewParticipant(respMsg);
            break;
          case "RECEIVE_VIDEO_ANSWER":
            receiveVideoResponse(respMsg);
            break;
          case "iceCandidate":
            onIceCandidate(respMsg);
            break;
          case "LEFT_PARTICIPANT":
            onLeftParticipant(respMsg);
            break;
          default:
            console.error("Unrecognized message", respMsg);
        }
      };
      wsRef.current.send(
        JSON.stringify({
          id: "join",
          room: params?.id,
          user: currentUser?.id,
        })
      );
    };
    return () => {};
  }, []);

  useEffect(() => {
    const getLocalStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        (localVideoRef.current as any).srcObject = stream;
      }
    };
    getLocalStream();
    return () => {
      if (wsRef.current.readyState == 1) {
        wsRef.current.send(
          JSON.stringify({
            id: "leave",
          })
        );
        Object.values(globalWebRtcPeers).map((wrp) => {
          (wrp as WebRtcPeer).dispose();
        });
      }
      wsRef.current.close();
    };
  }, []);

  // 정의부

  // onExistingParticipants
  const onExistingParticipants = async (respMsg: any) => {
    isExistingEvent = true;
    const options = {
      localVideo: localVideoRef.current,
      mediaConstraints: {
        audio: true,
        video: {
          mandatory: {
            maxWidth: 320,
            maxFrameRate: 15,
            minFrameRate: 15,
          },
        },
      },
      onicecandidate: (candidate: any) => {
        wsRef.current.send(
          JSON.stringify({
            id: "onIceCandidate",
            candidate: candidate,
            name: currentUser?.id,
          })
        );
      },
    };

    const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
      options,
      (error) => {
        if (error) return console.error(error);
        webRtcPeer.generateOffer((error, offerSdp) => {
          if (error) return console.error(error);
          wsRef.current.send(
            JSON.stringify({
              id: "receive",
              sender: currentUser?.id,
              sdpOffer: offerSdp,
            })
          );
        });
      }
    );

    webRtcPeer.peerConnection.setConfiguration({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },

        // front 에서 .env 파일 같이 유출 안되게 .secrets.prod 에서 가지고 올꺼야 id,pw 를
        {
           urls: "turn:i11a807.p.ssafy.io:3478",
           username: "a807_hdh_ctrn",
           credential: "g1xPT5EBXTc277R3HZzh",
        },
      ],
    });

    globalWebRtcPeers = {
      ...globalWebRtcPeers,
      [currentUser?.id as string]: webRtcPeer,
    };

    var existingParVideoRef = {};
    var existingParNickname = {};

    respMsg.data.map((user: string) => {
      console.log(user);
      const newParNickname = getParticipantNickname(user);
      existingParNickname = {
        ...existingParNickname,
        [user]: newParNickname,
      };
      existingParVideoRef = {
        ...existingParVideoRef,
        [user]: React.createRef(),
      };
    });

    setRemoteVideos((prev) => ({ ...prev, ...existingParVideoRef }));
    setParticipantNickname((prev) => ({ ...prev, ...existingParNickname }));
  };

  // receiveVideoFrom
  const receiveVideoFrom = (userId: string) => {
    setRemoteVideos((prev) => ({ ...prev, [userId]: React.createRef() }));
  };

  // onNewParticipant
  const onNewParticipant = (respMsg: any) => {
    NewParticipantId = respMsg.userId;
    const newParNickname = getParticipantNickname(respMsg.userId);
    setParticipantNickname((prev) => ({
      ...prev,
      [respMsg.userId]: newParNickname,
    }));

    receiveVideoFrom(respMsg.userId);
  };

  const getParticipantNickname = async (uuid: string) => {
    const resp = await api.get("/member/search/" + uuid);
    return resp.data;
  };

  // receiveVideoFromAfterPart
  const receiveVideoFromAfterPart = (userId: string) => {
    const videoRef = (remoteVideos as any)[userId];
    if (videoRef == undefined) return;
    const options = {
      remoteVideo: videoRef.current,
      onicecandidate: (candidate: any) => {
        wsRef.current.send(
          JSON.stringify({
            id: "onIceCandidate",
            candidate: candidate,
            name: userId,
          })
        );
      },
    };

    const webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
      options,
      (error) => {
        if (error) return console.error(error);
        webRtcPeer.generateOffer((error: any, offerSdp: any) => {
          if (error) return console.error(error);
          wsRef.current.send(
            JSON.stringify({
              id: "receive",
              sender: userId,
              sdpOffer: offerSdp,
            })
          );
        });
      }
    );

    webRtcPeer.peerConnection.setConfiguration({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        {
           urls: "turn:i11a807.p.ssafy.io:3478",
           username: "a807_hdh_ctrn",
           credential: "g1xPT5EBXTc277R3HZzh",
        },
      ],
    });

    globalWebRtcPeers = { ...globalWebRtcPeers, [userId]: webRtcPeer };
  };

  // receiveVideoResponse
  const receiveVideoResponse = (respMsg: any) => {
    const webRtcPeer: WebRtcPeer = (globalWebRtcPeers as any)[respMsg.userId];
    if (webRtcPeer) {
      webRtcPeer.processAnswer(respMsg.sdpAnswer, (error: any) => {
        if (error) return console.error(error);
      });
    }
  };

  // onIceCandidate
  const onIceCandidate = (respMsg: any) => {
    const webRtcPeer: WebRtcPeer = (globalWebRtcPeers as any)[respMsg.userId];
    if (webRtcPeer) {
      (webRtcPeer as WebRtcPeer).addIceCandidate(respMsg.candidate, (error) => {
        if (error) return console.error(error);
      });
    }
  };

  const onLeftParticipant = (respMsg: any) => {
    if ((globalWebRtcPeers as any)[respMsg.userId]) {
      ((globalWebRtcPeers as any)[respMsg.userId] as WebRtcPeer).dispose();
    }

    delete (globalWebRtcPeers as any)[respMsg.userId];
    delete (participantNickname as IParNickname)[respMsg.userId];
    isLeftEvent = true;
    setRemoteVideos((ori) => {
      const newRemoteVideos = { ...ori };
      delete (newRemoteVideos as any)[respMsg.userId];
      return newRemoteVideos;
    });
  };

  const toggleIsMute = (userId: string) => {
    (remoteVideos as any)[userId].current.muted = !(remoteVideos as any)[userId]
      .current.muted;
  };

  return (
    <Container>
      <Participant>
        <NickNameContainer>
          <span>{currentUser?.nickname}</span>
        </NickNameContainer>
        <VideoContainer>
          <video ref={localVideoRef} autoPlay />
        </VideoContainer>
      </Participant>
      {Object.entries(remoteVideos).map(([par, videoRef]) => (
        <Participant key={par}>
          <NickNameContainer>
            <span>{(participantNickname as IParNickname)[par]}</span>
          </NickNameContainer>
          <VideoContainer>
            <span className="material-icons" onClick={() => toggleIsMute(par)}>
              mic
            </span>
            <video key={par} ref={videoRef as any} autoPlay />
          </VideoContainer>
        </Participant>
      ))}
      <FloatingChat>
        <ChatComponent></ChatComponent>
      </FloatingChat>
    </Container>
  );
};

export default GroupCall;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: center;
  padding: 0.5rem;
  // border: 1px lime solid;
  // * {
  //   border: 1px lime solid;
  // }
  position: relative;
`;

const Participant = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 1rem;
`;
const NickNameContainer = styled.div`
  display: flex;
  width: 100%;
  span {
    display: block;
    width: 100%;
    text-align: end;
    white-space: nowrap;
    overflow: hidden;
    color: white;
    text-overflow: ellipsis;
    text-weight: bold;
    margin: 0 0 0.3rem 0;
  }
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  video {
    border-radius: 15px;
    display: flex;
    width: 100%;
  }
  span {
    position: absolute;
    right: 85%;
    top: 5%;
    z-index: 1;
    &:hover {
      color: red;
    }
  }
`;
const FloatingChat = styled.div`
  position: absolute;
  bottom: 0.5rem; 
  right: 0.5rem;
  width: 3rem 
  height: 3rem 
  z-index: 1000; 
`;
