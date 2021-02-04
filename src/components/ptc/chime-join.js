import React, { useState } from 'react';
import axios from 'axios';
import {
  MeetingProvider,
  lightTheme,

  VideoTileGrid,
  PreviewVideo,

  SpeakerSelection,
  MicSelection,
  QualitySelection,

  RosterAttendee,

  useMeetingManager,

  AudioInputControl,
  AudioOutputControl,

  ContentShareControl,
  VideoInputControl,

  MicrophoneActivity,

  LocalVideo,
  useLocalVideo,

  RemoteVideo,
  RemoteVideos,

  ContentShare,
  useContentShareControls,

  useRosterState,
  Roster,
  RosterGroup,
  RosterCell,

  ControlBar,
  ControlBarItem,

  Microphone
} from 'amazon-chime-sdk-component-library-react';
import { ThemeProvider } from 'styled-components';

const MyChild = () => {
  const { roster } = useRosterState();
  const attendees = Object.values(roster);

  console.log(attendees)

  const attendeeItems = attendees.map(attendee => {
    const { chimeAttendeeId, externalUserId } = attendee;
    let split = externalUserId.split('#')
    return (
      <RosterAttendee name={split[1]} key={chimeAttendeeId} attendeeId={chimeAttendeeId} />
    );
  });

  return (
    <Roster style={{width: '100%', height: '540px', border: '1px solid #e9e9e9', padding: '5px'}}>
      <RosterGroup>{attendeeItems}</RosterGroup>
    </Roster>
  );
};

const MyApp = async (props) => {
  const meetingManager = useMeetingManager();
  const { toggleVideo } = useLocalVideo();
  const { toggleContentShare } = useContentShareControls();

  const dataAttendee = props.attendee;

  const joinMeeting = async () => {
    const data = dataAttendee;

    const joinData = {
      meetingInfo: data.Meeting,
      attendeeInfo: data.Attendee
    };

    // Use the join API to create a meeting session
    await meetingManager.join(joinData);

    // At this point you can let users setup their devices, or start the session immediately
    await meetingManager.start();
  };

  const [muted, setMuted] = useState(false);

  const microphoneButtonProps = {
    icon: muted ? <Microphone muted /> : <Microphone />,
    onClick: () => setMuted(!muted),
    label: 'Mute'
  };

  return (
    <div>
      <div class="row">
        <div class="col-sm-12" style={{ zIndex: '1', paddingTop: '5px', paddingLeft: '20px', paddingRight: '20px' }}>
          <ControlBar style={{width: '100%'}}>
            <button onClick={joinMeeting} className={'btn btn-icademy-primary mr-2 mt-2'}>Join Video</button>
            <AudioInputControl />
            <AudioOutputControl />
            <VideoInputControl />
            <button onClick={toggleContentShare} className={'btn btn-icademy-primary mr-2 mt-2'}>Screenshare</button>
          </ControlBar>
        </div>

        <div class="col-sm-3" style={{ paddingLeft: '20px', paddingTop: '5px', marginRight: '-20px', marginBottom: '5px'}}>
          <MyChild />
        </div>

        <div class="col-sm-9" style={{ paddingLeft: '10px', paddingTop: '5px', paddingRight: '0px', marginBottom: '5px'}}>
          <VideoTileGrid style={{width: '100%', height: '540px', border: '1px solid #e9e9e9', padding: '5px'}} />
        </div>
      </div>
    </div>
  );
};

export default MyApp;
