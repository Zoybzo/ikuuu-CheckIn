const axios = require('axios');

const checkIn = async (cookie) => {
    return axios({
        method: 'post',
        url: 'https://ikuuu.co/user/checkin',
        headers: {
            'Cookie': cookie
        },
        data: {
            token: "ikuuu_network"
        }
    });
};

const checkInAndGetStatus = async (cookie) => {
    const checkInMessage = (await checkIn(cookie))?.data?.message;

    return {
        '签到情况': checkInMessage
    };
};

const pushplus = (token, infos) => {
    const titleCheckInMessage = infos?.[0]['签到情况'];

    const title = (
        '签到情况: ' + `${titleCheckInMessage}`
    ).slice(0, 100);

    const data = {
        token,
        title,
        content: JSON.stringify(infos),
        template: 'json'
    };
    console.log(data);

    return axios({
        method: 'post',
        url: `http://www.pushplus.plus/send`,
        data
    });
};

const ikuuuCheckIn = async () => {
    try {
        const cookies = process.env.IKUUU_COOKIES?.split('&&') ?? [];

        const infos = await Promise.all(cookies.map(async cookie => await checkInAndGetStatus(cookie)));
        console.log(infos);

        const PUSHPLUS = process.env.PUSHPLUS;

        if (PUSHPLUS && infos.length) {
            const pushResult = (await pushplus(PUSHPLUS, infos))?.data?.msg;
            console.log(pushResult);
        }
    } catch (error) {
        console.log(error);
    }
};

ikuuuCheckIn();
