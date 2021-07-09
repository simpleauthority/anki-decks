import * as fs from 'fs/promises'

(async () => {
    let handle

    try {
        let filename = process.argv[2]
        if (!filename) {
            console.error("No words file given!")
            return
        }

        let targetFilename = process.argv[3]
        if (!targetFilename) {
            console.error("No target filename given!")
            return
        }

        let imagePath = process.argv[4]
        if (!imagePath) {
            console.error("No image path given!")
            return
        }

        console.log(`Reading words file ${filename}...`)
        handle = await fs.open(filename)
        let content = await handle.readFile({ encoding: 'utf-8' })
        content = content.split("\n")
        await handle.close()

        console.log('Performing in-memory replacements...')
        content = content.map(line => {
            line = line.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            let word = line.split(";")[2]
            line = `${line};${imagePath}${word}.jpg`
            return line
        })

        content = content.join("\n")

        console.log('Dumping content into target file...')
        await fs.writeFile(targetFilename, content)

        console.log('Done. Cleaning up...')
    } catch (err) {
        console.error('Something went seriously wrong')
        console.error(err)
    } finally {
        console.log('Closing remaining file handle...')
        await handle.close()

        console.log('Done! Goodbye.')
    }
})();