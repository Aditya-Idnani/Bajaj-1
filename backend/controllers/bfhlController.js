const { buildTreeData } = require('../utils/treeBuilder');

const processBfhl = (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ error: "Invalid input format" });
        }

        const result = buildTreeData(data);
        
        res.status(200).json({
            user_id: "aditya_idnani_01012000",
            email_id: "ai3860@srmist.edu.in",
            college_roll_number: "RA2311003030385",
            ...result
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { processBfhl };
