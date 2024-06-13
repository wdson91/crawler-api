const mongoose = require("mongoose");

const OrgData = mongoose.model("OrgData", {
  data: {
    type: Object,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = OrgData;
