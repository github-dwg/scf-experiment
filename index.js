//'use strict';
exports.main_handler = async (event, context, callback) => {
    let params = {}
    let scripts = []
    const single_flag = event["Message"] != 'config'
    if (single_flag) {
        if (!event["Message"]) {
            console.error('ERROR, NO ARGUMENTS FOUND!!!')
            return
        }
        console.log('参数触发方式(不读取配置文件,快速触发),触发参数:', event["Message"])
        scripts = event["Message"].split("&")
    } else {
        const now_hour = (new Date().getUTCHours() + 8) % 24
        console.log('hourly config触发:', now_hour)
        const { readFileSync, accessSync, constants } = require('fs')
        const config_file = 'config.json'
        try {
            await accessSync('./' + config_file, constants.F_OK)
            console.log(`${config_file} 存在`)
        } catch (err) {
            console.error(`${config_file} 不存在,结束`)
            return
        }
        let config
        try {
            config = JSON.parse(await readFileSync(config_file))
        } catch (e) {
            console.error(`read config error:${e}`)
            return
        }
        // console.debug(JSON.stringify(config))
        params = config['params']
        delete config['params']

        const config_diy_file = 'config_diy.json'
        try {
            await accessSync('./' + config_diy_file, constants.F_OK)
            console.log(`${config_diy_file} 存在`)
            const config_diy = JSON.parse(await readFileSync(config_diy_file))
            if (config_diy['params']) {
                params = { ...params, ...config_diy['params'] }
                delete config_diy['params']
            }
            config = { ...config, ...config_diy }
        } catch (err) {
            console.error(`${config_diy_file} 不存在或解析异常`)
        }
        console.log("params:", params)
        for (let script in config) {
            // console.debug(`script:${script}`)
            const cron = config[script]
            if (typeof cron == 'number') {
                // console.debug(`number param:${cron}`)
                if (now_hour % cron == 0) {
                    console.debug(`${script}:number cron triggered!`)
                    scripts.push(script)
                }
            } else {
                // console.debug(`dict param:${cron}`)
                if (cron.includes(now_hour)) {
                    console.debug(`${script}:array cron triggered!`)
                    scripts.push(script)
                }
            }
        }
    }
    if (process.env.NOT_RUN) {
        const not_run = process.env.NOT_RUN.split("&")
        scripts = scripts.filter(script => {
            const flag = not_run.includes(script)
            if (flag) {
                console.log(`not run:${script}`)
            }
            return !flag
        })
    }
    if (!scripts.length) {
        console.log('No Script to Execute, Exit!')
        return
    }
    const is_sync = (params['global'] && params['global']['exec'] == 'sync')
    console.log('当前是', is_sync ? '同' : '异', '步执行')
    const exec = is_sync ? require('child_process').execFileSync : require('child_process').execFile
    const min = 1000 * 60
    const param_names = ['timeout']
    for (const script of scripts) {
        const name = './' + script + '.js'
        const param_run = {}
        if (!single_flag) {
            const param = params[script]
            for (const param_name of param_names) {
                if (param) {
                    if (param[param_name]) {
                        console.debug(`${script} has specific ${param_name}:${param[param_name]}`)
                        param_run[param_name] = min * param[param_name]
                    }
                } else if (params['global'] && params['global'][param_name]) {
                    console.debug(`${script} use global ${param_name}`)
                    param_run[param_name] = min * params['global'][param_name]
                } else {
                    console.warn(`No global ${param_name}!`)
                }
            }
        }
        if (is_sync) {
            try {
                console.log(`run script:${script},please waitting for log`)
                const result = await exec(process.execPath, [name], param_run)
                console.log(result.toString())
                console.log(`${script} finished`)
            } catch (e) {
                console.error(`${script} (sync) ERROR:${e}`)
                console.error(`stdout:${e.stdout}`)
            }
        } else {
            try {
                const child = exec(process.execPath, [name], param_run)
                child.stdout.on('data', function(data) {
                    console.log(`${script}:`, data)
                })
                child.stderr.on('data', function(data) {
                    console.error(`${script} ERROR:`, data)
                })
                child.on('close', function(code) {
                    console.log(`${script} finished`)
                })
            } catch (e) {
                console.error(`${script} (async) ERROR:${e}`)
            }
        }
    }
}
