import * as fs from 'fs/promises'

(async () => {
    let printTable = table => {
        console.table(table, ["Type", "Tagalog", "English"])
        return []
    }

    let handle
    try {
        let filename = process.argv[2]

        console.log(`Opening ${filename}...`)
        handle = await fs.open(filename)

        console.log('Reading file...')
        let content = await handle.readFile({ encoding: 'utf-8' })
        content = content.split("\n")
        
        console.log('=====================================================')
        let cat = '', table = []
        content.forEach(line => {
            let split = line.split(";")

            if (cat != split[0]) {
                if (table.length) {
                    table = printTable(table)
                }

                cat = split[0]
            }

            table.push({
                "Type": split[0],
                "Tagalog": split[1],
                "English": split[2].replace('\r', '')
            })
        })

        printTable(table)
        console.log('=====================================================')
    } catch (err) {
        console.error('Something went seriously wrong!')
        console.error(err)
    } finally {
        console.log('Closing file handle...')
        await handle.close()
        console.log('Done! Goodbye.')
    }
})();