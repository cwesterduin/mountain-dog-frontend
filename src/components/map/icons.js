import L from 'leaflet'

import munroIcon from '../../../static/munro.svg'
import corbettIcon from '../../../static/corbett.svg'
import bikeIcon from '../../../static/bike.svg'
import swimIcon from '../../../static/swim.svg'
import walkIcon from '../../../static/walk.svg'
import kayakIcon from '../../../static/kayak.svg'
import viewIcon from '../../../static/view.svg'

// Init custom map icons
let icons = {}
  if (typeof window !== 'undefined') {
    icons.munro = new L.Icon({
    iconUrl: munroIcon,
    iconRetinaUrl: munroIcon,
    popupAnchor: [0, -16],
    iconSize: [16,16],
    iconAnchor: [8,16],
  })
    icons.corbett = new L.Icon({
    iconUrl: corbettIcon,
    iconRetinaUrl: corbettIcon,
    popupAnchor: [0, -16],
    iconSize: [16,16],
    iconAnchor: [8,16],
  })
    icons.bike = new L.Icon({
    iconUrl: bikeIcon,
    iconRetinaUrl: bikeIcon,
    popupAnchor: [0, -16],
    iconSize: [16,16],
    iconAnchor: [8,16],
  })
    icons.swim = new L.Icon({
    iconUrl: swimIcon,
    iconRetinaUrl: swimIcon,
    popupAnchor: [0, -16],
    iconSize: [16,16],
    iconAnchor: [8,16],
  })
    icons.walk = new L.Icon({
    iconUrl: walkIcon,
    iconRetinaUrl: walkIcon,
    popupAnchor: [0, -16],
    iconSize: [16,16],
    iconAnchor: [8,16],
  })
  icons.kayak = new L.Icon({
  iconUrl: kayakIcon,
  iconRetinaUrl: kayakIcon,
  popupAnchor: [0, -16],
  iconSize: [16,16],
  iconAnchor: [8,16],
  })
  icons.view = new L.Icon({
  iconUrl: viewIcon,
  iconRetinaUrl: viewIcon,
  popupAnchor: [0, -16],
  iconSize: [16,16],
  iconAnchor: [8,16],
  })
  icons.greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
  });
  icons.redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
  });
}
// Init key icons
let keyIcons = {}
    keyIcons.munro = munroIcon
    keyIcons.corbett = corbettIcon
    keyIcons.bike = bikeIcon
    keyIcons.swim = swimIcon
    keyIcons.walk = walkIcon
    keyIcons.kayak = kayakIcon
    keyIcons.view = viewIcon


export {icons, keyIcons}
