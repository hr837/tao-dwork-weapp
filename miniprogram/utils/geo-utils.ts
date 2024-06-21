
/**
 * 计算距离
 * @param lat1 起始点纬度
 * @param lon1 起始点经度
 * @param lat2 结束点纬度
 * @param lon2 结束点经度
 * @param unit 单位
 */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: 'km' | 'm' | 'nautical' = 'm') {
  const theta = lon1 - lon2
  let distance = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta))
  distance = Math.acos(distance)
  distance = rad2deg(distance)

  distance = distance * 60 * 1.1515

  if (unit == "m") {
    distance = distance * 1609.344
  } else if (unit == "km") {
    distance = distance * 1.609344
  } else if (unit == "nautical") {
    distance = distance * 0.8684
  }

  return distance
}

/**
 * 
 * @param deg 
 */
export function deg2rad(deg: number) {
  return (deg * Math.PI) / 180.0
}

/**
 * 
 * @param rad 
 */
export function rad2deg(rad: number) {
  return (rad * 180.0) / Math.PI
}