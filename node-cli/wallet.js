#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');

const { version } = require('./package');
const { sequelize, Wallet } = require('./models');

let triggered = false;

program
    .version(version, '-v, --version')
    .usage('[options]');

//수입
program
    .command('revenue <monet> <desc>')
    .description('수입을 기록합니다.')
    .action(async(money, desc) => {
        await sequelize.sync();
        await Wallet.create({
            money: parseInt(money, 10),
            desc,
            type: true,
        });
        console.log(`${money}원을 얻었습니다.`);
        await sequelize.close();
        triggered = true;
    });
//지출
program
    .command('expense <money> <desc>')
    .description('지출을 기록합니다.')
    .action(async(money, desc) => {
        await sequelize.sync();
        await Wallet.create({
            money: parseInt(money, 10),
            desc,
            type: false,
        });
        console.log(`${money}원을 썼습니다.`);
        await sequelize.close();
        triggered = true;
    });
//잔액
program
    .command('balance')
    .description('잔액을 표시합니다.')
    .action(async() => {
        await sequelize.sync();
        const logs = await Wallet.findAll({});
        const revenue = logs.filter(l => l.type === true).reduce((acc,cur) => acc + cur.money, 0);
        const expense = logs.filter(l => l.type === false).reduce((acc,cur) => acc + cur.money, 0);
        console.log(`${revenue - expense}원 남았습니다.`);
        await sequelize.close();
        triggered = true;
    });

program
    .command('*')
    .action(() => {
        console.log('알 수 없는 명령어입니다.');
        triggered = true;
    })

program.parse(process.argv);

if(!triggered){
    inquirer.prompt([{
        type: 'list',
        name: 'type',
        message: '보고자 하는 종류를 선택하세요.',
        choices: ['수입', '지출', '잔액'],
    }, {
        type: 'input',
        name: 'money',
        message: '금액을 입력하세요.',
        default: '0',
    }, {
        type: 'input',
        name: 'desc',
        message: '설명을 입력하세요.',
        default: '.',
    }, {
        type: 'confirm',
        name: 'confirm',
        message: '생성하시겠습니까?',
    }])
        .then(async (answers) => {
            if(answers.confirm) {
                if(answers.type === '수입'){
                    await sequelize.sync();
                    await Wallet.create({
                        money: parseInt(answers.money, 10),
                        desc: answers.desc,
                        type: true,
                    });
                    console.log(`${answers.money}원을 얻었습니다.`);
                    await sequelize.close();
                } else if (answers.type === '지출'){
                    await sequelize.sync();
                    await Wallet.create({
                        money: parseInt(answers.money, 10),
                        desc: answers.desc,
                        type: false,
                    });
                    console.log(`${answers.money}원을 썼습니다.`);
                    await sequelize.close();
                } else {
                    await sequelize.sync();
                    const logs = await Wallet.findAll({});
                    const revenue = logs.filter(l => l.type === true).reduce((acc,cur) => acc + cur.money, 0);
                    const expense = logs.filter(l => l.type === false).reduce((acc,cur) => acc + cur.money, 0);
                    console.log(`${revenue - expense}원 남았습니다.`);
                    await sequelize.close();
                }
            }
        });
}