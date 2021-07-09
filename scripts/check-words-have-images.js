import * as fs from 'fs/promises'

(async () => {
    let wordFileHandle

    try {
        let filename = process.argv[2]
        if (!filename) {
            console.error("No filename specified...")
            return
        }

        console.log(`Opening ${filename}...`)
        wordFileHandle = await fs.open(filename)
        let wordFileContent = await wordFileHandle.readFile({ encoding: 'utf-8' })
        wordFileContent = wordFileContent.split("\n")

        // read words and check that they have an entry in images folder
        let imageFolderPath = process.argv[3]
        if (!imageFolderPath) {
            console.error("No image folder path specified...")
            return
        }

        let wordsWithoutImages = 0, wordsWithImages = 0
        for (let word of wordFileContent) {
            word = word.split(";")[2].replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

            console.log('\x1b[0m', `Checking "${word}"...`)
            try {
                await fs.access(`${imageFolderPath}/${word}.jpg`)
                console.log('\x1b[32m', `>> ${word} has corresponding image!`)
                wordsWithImages++
            } catch (err) {
                console.log('\x1b[31m', `>> ${word} DOES NOT have a corresponding image!`)
                wordsWithoutImages++
            }
        }

        console.log('\x1b[36m', `Words WITH images: ${wordsWithImages}`)
        console.log('\x1b[36m', `Words WITHOUT images: ${wordsWithoutImages}`)
        console.log('\x1b[0m', 'Done. Cleaning up...')
    } catch (err) {
        console.error('Something went seriously wrong')
        console.error(err)
    } finally {
        console.log('Closing remaining file handle...')
        await wordFileHandle.close()

        console.log('Done! Goodbye.')
    }
})();