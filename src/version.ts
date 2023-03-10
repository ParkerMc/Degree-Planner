import { version } from '../package.json'

export default version
export const [majorVersion, minorVersion, patchVersion] = version
    .split('.')
    .map((v) => +v)
