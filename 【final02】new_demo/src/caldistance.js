export default function calculateDistance(lat1, lon1, lat2, lon2) {//纬度1，精度1，纬度2，精度2
    const earthRadiusKm = 6371; // 地球半径，单位为千米
  
    // 将经纬度转换为弧度
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);
  
    // 应用 Haversine 公式计算距离
    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
  
    return distance;
  }
  
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  function filterData(data,lng,lat){
    let filterData=[];
    filterData=data.filter(v=>{
      // console.log(calculateDistance(v[2],lng,v[1],lat))  
      return calculateDistance(lat,lng,v[1],v[2])<200//筛选距离
    })
    return filterData;
  }
  export {filterData}