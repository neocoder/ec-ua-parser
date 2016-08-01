/*global app*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	vendor: [String],
	names: [ String ],

	spec: Schema.Types.Mixed,
	lastUpdated: { type: Date, default: Date.now }
/*
{ design:
   { deviceType: 'Smart phone',
     os: 'Android (5.0, 4.4.4), Samsung TouchWiz UI',
     formFactor: 'Candybar',
     dimensions:
      { inches: [ '5.57', '2.76', '0.29' ],
        mm: [ '141.6', '70.2', '7.3' ] },
     weight: [ '4.94 oz', '140 g' ],
     materials: { mainBody: 'plastic', accents: 'metal' },
     keys: { left: 'Volume control', right: 'Lock/Unlock key' },
     colors: [ 'Black', 'Brown', 'White' ] },
  display:
   { physicalSize: '5.0 inches',
     resolution: '720 x  1280 pixels',
     pixelDensity: '294 ppi',
     technology: 'Super AMOLED',
     screenToBodyRatio: '69.49 %',
     colors: '16 777 216',
     touchscreen: [ 'Capacitive', 'Multi-touch' ],
     features:
      [ 'Light sensor',
        'Proximity sensor',
        'Scratch-resistant glass (Corning Gorilla Glass 4)' ] },
  camera:
   { camera:
      { resolution: '8 megapixels',
        flash: 'LED',
        hardwareFeatures: 'Autofocus, CMOS image sensor',
        softwareFeatures: 'Face detection, Smile detection, Digital zoom, Voice activation, Self-timer, Touch to focus, Geo tagging',
        settings: 'Exposure compensation, ISO control, White balance presets',
        shootingModes: 'Burst mode, High Dynamic Range mode (HDR), Panorama, Night mode, Effects' },
     camcorder:
      { resolution: '1920x1080 (1080p HD) (30 fps)',
        features: [ 'Video calling', 'Video sharing' ] },
     frontFacingCamera: '5 megapixels' },
  hardware:
   { systemChip: 'Qualcomm Snapdragon 410\nModel:8916',
     processor: 'Quad-core, 1200 MHz, ARM Cortex-A53',
     graphicsProcessor: 'Adreno 306',
     systemMemory: '1536 MB RAM (533 MHz)',
     builtInStorage: '16 GB',
     storageExpansion: 'microSD, microSDHC, microSDXC up to 64 GB' },
  battery:
   { capacity: '2400 mAh',
     talkTime3G: '16.00 hoursthe average is 16 h (978 min)',
     musicPlayback: '71.00 hours',
     videoPlayback: '12.00 hours' },
  multimedia:
   { musicPlayer: 'Filter by:Album, Artist, Playlists\nFeatures:Album art cover, Background playback\nSupported formats:MP3',
     videoPlayback: 'Supported formats:MPEG4, H.263, H.264',
     speakers: [ 'Earpiece', 'Loudspeaker' ],
     headphonesConnector: '3.5mm' },
  browsing:
   { browser: { supports: 'HTML, HTML5' },
     builtInOnlineServicesSupport: 'YouTube (upload), Picasa/Google+' },
  cellular:
   { gsm: '850, 900, 1800, 1900 MHz',
     umts: '850, 900, 1900, 2100 MHz',
     data: 'HSDPA+ (4G) 42.2 Mbit/s, HSUPA 5.76 Mbit/s',
     '2GData': 'EDGE, GPRS',
     nanoSim: 'Yes',
     globalRoaming: 'Yes' },
  connectivity:
   { bluetooth:
      { version: '4.0',
        profilesProtocols:
         [ 'Advanced Audio Distribution (A2DP)',
           'Attribute Protocol',
           'Audio/Video Control Transport Protocol (AVCTP)',
           'Audio/Video Distribution Transport Protocol (AVDTP)',
           'Audio/Visual Remote Control Profile (AVRCP)',
           'Bluetooth Network Encapsulation Protocol (BNEP)',
           'Device ID Profile (DID)',
           'Generic Access (GAP)',
           'Generic Attribute Profile (GATT)',
           'Generic Audio/Video Distribution (GAVDP)',
           'Handsfree (HFP)',
           'Headset (HSP)',
           'HID over GATT Profile',
           'Human Interface Device (HID)',
           'Logical Link Control and Adaptation Protocol',
           'Message Access Profile (MAP)',
           'Multi-Channel Adaptation Protocol',
           'Object Push (OPP)',
           'Personal Area Networking Profile (PAN)',
           'Phone Book Access (PBAP)',
           'Scan Parameters Profile',
           'Security Manager Protocol',
           'Serial Port (SPP)',
           'Service Discovery Protocol (SDP)',
           'SIM Access (SAP)' ] },
     wiFi: { standards: '802.11 b, g, n', wiFiDirect: false },
     usb:
      { version: 'USB 2.0',
        connector: [ 'microUSB' ],
        features: [ 'Mass storage device', 'USB charging' ] },
     chargingConnector: 'microUSB',
     positioning: 'GPS, A-GPS, Glonass',
     navigation: true,
     other: 'Tethering, Computer sync, OTA sync' },
  other:
   { notifications: 'Haptic feedback, Music ringtones (MP3), Polyphonic ringtones, Vibration, Flight mode, Silent mode, Speakerphone',
     sensors: 'Accelerometer, Compass',
     other1: 'Voice dialing, Voice commands, Voice recording' },
  availability: { officiallyAnnounced: '06 Jan 2015' } }
//*/
}, { collection: 'devices_specs' });

schema.index({ names: 'text' });

schema.pre('save', function(next){
	this.lastUpdated = new Date();
	next();
});


module.exports = mongoose.model('Spec', schema);
