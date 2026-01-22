import Url from "../Models/url.js";

const redirect = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const response = await Url.findOneAndUpdate(
      { shortId: id },
      {
        $push: {
          analytics: { timestamp: Date.now() },
        },
      },
      { new: true }
    );
    if (!response)
      return res.status(404).send({
        message: "short Id not found",
        shortId: id,
      });

    res.redirect(response.originalUrl); //redirect automatically sends the status code 302
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export default redirect;
