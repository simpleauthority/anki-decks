import * as fs from 'fs/promises'

const pad = num => {
    return String(num).padStart(5, '0')
}

(async () => {
    let handle
    try {
        console.log('Opening first file...')
        handle = await fs.open('./words-with-tagalog.txt')

        console.log('Reading first file...')
        let content = await handle.readFile({ encoding: 'utf-8' })
        content = content.split("\n")

        console.log('Closing first file...')
        await handle.close()

        console.log('First file closed. Performing in-memory replacements...')
        
        let num = 1
        
        content = content.map(line => {
            line = `E:\\TagalogWords\\Pictures\\Image${pad(num)}.jpg;${line}`
            num++
            return line
        })

        content = content.join("\n")

        console.log('Dumping content into target file...')
        await fs.writeFile('./words-with-tagalog-and-images.txt', content)

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