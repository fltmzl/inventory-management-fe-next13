import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { api } from "@/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { setAccessToken } from "@/helpers/auth";
import BrandLogo from "@/shared/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Format email salah")
        .required("Email harus diisi"),
      password: Yup.string()
        .min(8, "Password minimal 8 karakter")
        .required("Password harus diisi"),
    }),
    onSubmit: async (values) => {
      try {
        const user = await api.post("/auth/login", {
          email: values.email,
          password: values.password,
        });

        setAccessToken(user.data.access_token);
        router.replace("/dashboard");
      } catch (error) {
        console.log(error);
        toast.error("Gagal login. Email atau Password salah");
      }
    },
  });

  const isEmailError = Boolean(formik.errors.email && formik.touched.email);
  const isPasswordError = Boolean(
    formik.errors.password && formik.touched.password,
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-center text-5xl font-bold mb-3">LOGIN</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="p-10 w-full max-w-xl flex flex-col gap-5"
      >
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          isInvalid={isEmailError}
          errorMessage={isEmailError ? formik.errors.email : ""}
          onBlur={formik.handleBlur}
        />

        <Input
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          isInvalid={isPasswordError}
          errorMessage={isPasswordError ? formik.errors.password : ""}
          onBlur={formik.handleBlur}
        />

        <Button
          color="primary"
          size="lg"
          className="font-semibold"
          type="submit"
          isLoading={formik.isSubmitting}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
