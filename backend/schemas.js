import yup from "yup";

export const loginSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
});

// obviously there should be more requirements for the password
// but for now it will do just to validate the input and not use
// the loginSchema for the register
export const registerSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
});

export const productSchema = yup.object({
    name: yup.string().required("Name is required"),
    price: yup.number().required("Price is required").positive("Price must be positive").integer("Price must be an integer"),
});