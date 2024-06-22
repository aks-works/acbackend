const yup=require("yup")
exports.addBlogSchema=yup.object().shape({
    title:yup
    .string()
    .required("Title is required")
    .min(5,"Title can't be less than 5")
    .max(100,"Title can't be more than 100"),
    body:yup.string().required("Body is Required")
})