// builtin
import { tmpdir } from 'os'
import { join } from 'path'

// external
import { equal, deepEqual } from 'assert-helpers'
import kava from 'kava'
import write from '@bevry/fs-write'
import { isAccessible } from '@bevry/fs-accessible'
import promiseErrback from 'promise-errback'

// local
import unlink from './index.js'

kava.suite('@bevry/fs-unlink', function (suite, test) {
	test('works as expected', function (done) {
		promiseErrback(
			Promise.resolve().then(async function () {
				// prepare the paths
				const directory = join(tmpdir(), `bevry-fs-unlink-${Math.random()}`)
				const file1 = join(directory, 'file1.txt')
				const file2 = join(directory, 'file2.txt')
				const data1 = String(Math.random())
				const data2 = String(Math.random())

				// create the paths, no need for mkdirp as write handles it
				await write(file1, data1)
				await write(file2, data2)
				deepEqual(
					await isAccessible([file1, file2]),
					[true, true],
					'is present when it is present'
				)

				// unlink the files
				await unlink([file1, file2])
				deepEqual(
					await isAccessible([file1, file2]),
					[false, false],
					'removals were as expected'
				)
			}),
			done
		)
	})
})
