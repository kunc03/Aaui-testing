import React, {useState, useEffect } from 'react';
import { API_JITSI } from '../../repository/api';

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
      api.executeCommand('displayName', konten.userName);
    });

    api.addEventListener('videoConferenceLeft', () => {
      // window.location.href = window.location.origin+'/liveclass';
      window.close();
    });

    api.executeCommand('avatarUrl', konten.userAvatar);
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
   {loading && <div>Loading...</div>}
   <div
    id="jitsi-container"
    style={jitsiContainerStyle}
   />
  </div>
 );
}

export default JitsiMeetComponent;