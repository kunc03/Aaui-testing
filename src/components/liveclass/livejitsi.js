import React, {useState, useEffect } from 'react';
import API, { API_JITSI, API_SERVER, API_SOCKET } from '../../repository/api';
import { CenturyView } from 'react-calendar';

function JitsiMeetComponent(props) {

  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [joining, setJoining] = useState(false);
  const containerStyle = {
    width: '100%',
    height: '600px',
  };

  const jitsiContainerStyle = {
    display: (loading ? 'none' : 'block'),
    width: '100%',
    height: '100%',
  }

  function startConference(konten) {
    setJoining(true);
    try {
      const domain = API_JITSI;
      const options = {
        jwt: konten.jwt,
        roomName: konten.roomName,
        height: 600,
        parentNode: document.getElementById('jitsi-container'),
        interfaceConfigOverwrite: {
          filmStripOnly: false,
          SHOW_JITSI_WATERMARK: false,
        },
        configOverwrite: {
          disableSimulcast: false,
        },
        userInfo: {
          email: konten.userEmail
        }
      };

      const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;
      const api = new JitsiMeetExternalAPI(domain, options);
      
      api.addEventListener('videoConferenceJoined', () => {
        setJoining(false);
        const classId = konten.roomId;
        const action = 'join';
        API.put(`${API_SERVER}v1/liveclass/active/${classId}`, {action: action}).then(res => {
          if(res.status === 200) {
            api.executeCommand('displayName', konten.userName);
          }
        })
      });

      api.addEventListener('screenSharingStatusChanged', () => {
          api.executeCommand('toggleVideo');
      });

      api.addEventListener('videoConferenceLeft', () => {
        const classId = konten.roomId;
        const action = 'leave';
        API.put(`${API_SERVER}v1/liveclass/active/${classId}`, {action: action}).then(res => {
          if(res.status === 200) {
            api.executeCommand('displayName', konten.userName);
            if (res.data.result.active_participants === 0){
              const classId = konten.roomId;
              API.delete(`${API_SERVER}v1/liveclass/file/delete/${classId}`).then(res => {
                if(res.status === 200) {
                  window.close();
                }
              })
            }
            else{
              window.close();
            }
          }
        })
      });
      api.executeCommand('avatarUrl', konten.userAvatar);
      !konten.startMic && api.executeCommand('toggleAudio');
      !konten.startCam && api.executeCommand('toggleVideo');

    } catch (error) {
     console.error('Failed to load Jitsi API', error);
    }
  }

  function checkWaiting(konten){
    setLoading(true);
    const interval = setInterval(() => {
      const classId = konten.roomId;
      API.get(`${API_SERVER}v1/liveclass/activeparticipant/${classId}`).then(res => {
        if(res.status === 200) {
          if ((res.data.result.active_participants === 0 && konten.moderator == true) || res.data.result.active_participants > 0){
            setWaiting(false);
            setLoading(false);
            startConference(props);
            clearInterval(interval);
          }
          else{
            setWaiting(true);
            setLoading(false);
          }
        }
      })
    }, 3000);
  }

  useEffect(() => {
  // verify the JitsiMeetExternalAPI constructor is added to the global..
    if (window.JitsiMeetExternalAPI) checkWaiting(props);
    else alert('Jitsi Meet API script not loaded');
  }, []);

 return (
  <div
   style={containerStyle}
  >
  {loading &&
    <div>
      <div style={{marginTop: 20, display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <img
          src="/assets/images/component/tes.png"
          className="img-fluid"
        />
        </div>
      <h3 style={{marginTop:10, textAlign:'center'}}>Loading...</h3>
    </div>
   }

   {joining &&
     <div>
       <div style={{marginTop: 20, display: 'flex',  justifyContent:'center', alignItems:'center'}}>
         <img
           src="/assets/images/component/tes.png"
           className="img-fluid"
         />
         </div>
       <h3 style={{marginTop:10, textAlign:'center'}}>Bergabung dalam meeting...</h3>
     </div>
    }

   {waiting &&
    <div>
      <div style={{marginTop: 20, display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <img
          src="/assets/images/component/tes.png"
          className="img-fluid"
        />
        </div>
      <h3 style={{marginTop:10, textAlign:'center'}}>Menunggu moderator...</h3>
    </div>
    }
    
   <div
    id="jitsi-container"
    style={jitsiContainerStyle}
   />
  </div>
 );
}

export default JitsiMeetComponent;