export default function handler(req, res) {
    const { accountID } = req.query;
    res.status(200).json({
        'accountID': accountID
    });
}