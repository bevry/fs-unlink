// builtin
import { unlink as _unlink } from 'fs'
import { versions } from 'process'
const nodeVersion = String(versions.node || '0')

// external
import accessible, { W_OK } from '@bevry/fs-accessible'
import Errlop from 'errlop'

/** Remove a file. */
export default async function unlink(
	path: string | Array<string>
): Promise<void> {
	if (Array.isArray(path)) {
		return Promise.all(path.map((i) => unlink(i))).then(() => {})
	}

	// check exists
	try {
		await accessible(path)
	} catch (err: any) {
		// if it doesn't exist, then we don't care
		return
	}

	// check writable
	try {
		await accessible(path, W_OK)
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			// if it doesn't exist, then we don't care (this may not seem necessary due to the earlier accessible check, however it is necessary, testen would fail on @bevry/json otherwise)
			return
		}
		throw new Errlop(`unable to remove the non-writable file: ${path}`, err)
	}

	// remove the file
	return new Promise(function (resolve, reject) {
		_unlink(path, function (err) {
			if (err) {
				return reject(
					new Errlop(
						`failed to remove the accessible and writable file: ${path}`,
						err
					)
				)
			}
			return resolve()
		})
	})
}
