import system from './system'
import client from './client'
import quartzjob from './quartzjob'
export default {
  ...system,
  ...client,
  ...quartzjob
}
