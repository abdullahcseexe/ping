// import { useSocketStore } from "../lib/socket";
// import { useAuth } from "@clerk/expo";
// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect } from "react";

// const SocketConnection = () => {
//   const { getToken, isSignedIn } = useAuth();
//   const queryClient = useQueryClient();
//   const connect = useSocketStore((state) => state.connect);
//   const disconnect = useSocketStore((state) => state.disconnect);

//   useEffect(() => {
//     if (isSignedIn) {
//       getToken().then((token) => {
//         if (token) connect(token, queryClient);
//       });
//     } else disconnect();

//     return () => {
//       disconnect();
//     };
//   }, [isSignedIn, connect, disconnect, getToken, queryClient]);

//   return null;
// };

// export default SocketConnection;

// import { useSocketStore } from "../lib/socket";
// import { useAuth } from "@clerk/expo";
// import { useQueryClient } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";

// const SocketConnection = () => {
//   const { getToken, isSignedIn } = useAuth();
//   const queryClient = useQueryClient();

//   const connect = useSocketStore((state) => state.connect);
//   const disconnect = useSocketStore((state) => state.disconnect);

//   const connectRef = useRef(connect);
//   const disconnectRef = useRef(disconnect);
//   useEffect(() => { connectRef.current = connect; }, [connect]);
//   useEffect(() => { disconnectRef.current = disconnect; }, [disconnect]);

//   useEffect(() => {
//     if (isSignedIn) {
//       console.log("🔌 Attempting socket connection...");
//       getToken({ skipCache: true }).then((token) => {
//         if (token) {
//           console.log("🎟️ Got token, connecting socket...");
//           connectRef.current(token, queryClient);
//         } else {
//           console.warn("⚠️ No token returned from getToken");
//         }
//       }).catch((err) => {
//         console.error("❌ getToken failed:", err);
//       });
//     } else {
//       console.log("🔌 Not signed in, disconnecting socket...");
//       disconnectRef.current();
//     }
//   }, [isSignedIn, getToken, queryClient]);

//   return null;
// };

// export default SocketConnection;

import { useSocketStore } from "../lib/socket";
import { useAuth } from "@clerk/expo";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const SocketConnection = () => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  // Stable refs so the effect doesn't re-run when zustand gives new function refs
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const connectRef = useRef(connect);
  const disconnectRef = useRef(disconnect);
  useEffect(() => { connectRef.current = connect; }, [connect]);
  useEffect(() => { disconnectRef.current = disconnect; }, [disconnect]);

  useEffect(() => {
    if (!isSignedIn) {
      disconnectRef.current();
      return;
    }

    let cancelled = false;

    getToken({ skipCache: true }).then((token) => {
      if (!cancelled && token) {
        connectRef.current(token, queryClient);
      }
    });

    // Only disconnect on actual sign-out, not on every render cleanup
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

export default SocketConnection;
