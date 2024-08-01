"use client";
import { WebRtcPeer } from "kurento-utils";
const GroupCall = () => {
  console.log(
    new WebRtcPeer("recv", function () {
      return null;
    })
  );
};

export default GroupCall;
