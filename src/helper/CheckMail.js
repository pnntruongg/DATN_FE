export default function CheckMail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let isCheck = regex.test(email);
    return isCheck;
};
