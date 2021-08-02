import React, {useState, useEffect } from 'react';
import API, { API_JITSI, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

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
    // setJoining(true);
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
          email: konten.userEmail,
          displayName: konten.userName
        }
      };

      const JitsiMeetExternalAPI = window.JitsiMeetExternalAPI;
      const api = new JitsiMeetExternalAPI(domain, options);
      
      api.addEventListener('videoConferenceJoined', () => {
        // update actual hadir
        
      let form = {
        confirmation: 'Hadir',
      }

      API.put(`${API_SERVER}v1/liveclass/actualattendance/${konten.roomId}/${Storage.get('user').data.user_id}`, form).then(async res => {
        if (res.status === 200) {
          console.log('Kehadiran Aktual : Hadir')
        }
      })

        // setJoining(false);
        const classId = konten.roomId;
        const numberOfParticipants = api.getNumberOfParticipants();
        API.put(`${API_SERVER}v1/liveclass/active/${classId}`, {numberOfParticipants: numberOfParticipants}).then(res => {
          if(res.status === 200) {
            // api.executeCommand('displayName', konten.userName);
            const interval = setInterval(() => {
              const classId = konten.roomId;
              const numberOfParticipants = api.getNumberOfParticipants();
              if (numberOfParticipants <= 0){
              }
              else{
                API.put(`${API_SERVER}v1/liveclass/active/${classId}`, {numberOfParticipants: numberOfParticipants}).then(res => {
                  if(res.status === 200) {
                    console.log('UPDATE ACTIVE PARTICIPANTS', res.data.result.active_participants)
                  }
                })
              }
            }, 3000);
          }
        })
      });

      api.addEventListener('screenSharingStatusChanged', () => {
          api.executeCommand('toggleVideo');
      });

      api.addEventListener('videoConferenceLeft', () => {
        const classId = konten.roomId;
        API.get(`${API_SERVER}v1/liveclass/activeparticipantpublic/${classId}`).then(response => {
        API.put(`${API_SERVER}v1/liveclass/active/${classId}`, {numberOfParticipants: response.data.result.active_participants-1}).then(res => {
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
      API.get(`${API_SERVER}v1/liveclass/activeparticipantpublic/${classId}`).then(res => {
        if(res.status === 200) {
          if ((konten.moderator == true) || res.data.result.active_participants > 0){
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