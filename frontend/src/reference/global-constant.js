// OpenStreetMap
const OSM_URL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTR = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

// 地理院タイル
const GIA_URL = "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg";
const GIA_ATTR = "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>";

// GoogleMapサテライト
const GMS_URL = 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
const GMS_ATTR = "";

// 農研機構土壌インベントリー
const SIV_URL = 'https://soil-inventory.dc.affrc.go.jp/tile/figure/{z}/{x}/{y}.png'
const SIV_ATTR = ""

export default({
                OSM_URL,
                OSM_ATTR,
                GIA_URL,
                GIA_ATTR,
                GMS_URL,
                GMS_ATTR,
                SIV_URL,
                SIV_ATTR
              })