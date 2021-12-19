import * as fs from 'fs/promises'

(async () => {
    let printTable = (table, fields) => {
        console.table(table, fields)
        return []
    }

    let handle
    try {
        let filename = process.argv[2]
        let fields = process.argv[3].split(";")

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

            let obj = {}
            for (let i = 0; i < fields.length; i++) {
                let entry = split[i]
                if (!entry) entry = ""

                obj[fields[i]] = entry.replace("\r", "")
            }

            table.push(obj)
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