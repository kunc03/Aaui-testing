import React, {useState, useEffect } from 'react';
import API, { API_JITSI, API_SERVER, API_SOCKET } from '../../repository/api';

function JitsiMeetComponent(props) {

  const [loading, setLoading] = useState(true);
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
        setLoading(false);
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

  useEffect(() => {
  // verify the JitsiMeetExternalAPI constructor is added to the global..
    if (window.JitsiMeetExternalAPI) startConference(props);
    else alert('Jitsi Meet API script not loaded');
  }, []);

 return (
  <div
   style={containerStyle}
  >
   {loading &&
    <div>
      <div>Loading...</div>
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