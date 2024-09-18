const midtransClient = require('midtrans-client');

const midtrans = new midtransClient.Snap({
  isProduction: true,
  serverKey: 'Mid-server-9t2QptoETl-V08RbEVTuEKV0', // Replace with your actual server key
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const orderDetails = req.body;
      const transaction = await midtrans.createTransaction(orderDetails);
      res.status(200).json({ token: transaction.token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
