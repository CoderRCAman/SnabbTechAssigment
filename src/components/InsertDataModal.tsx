import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CountryData from "@/Country_Mock_Data.json";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { COUNTRY_DATA_TYPE, INPUTS, USER } from "@/types";
import { saveToLocalStore } from "@/helper";
export default function InsertDataModal({
  open,
  onClose,
  setUser,
}: {
  open: boolean;
  onClose: () => void;
  setUser: React.Dispatch<React.SetStateAction<USER[]>>;
}) {
  const [options, setOptions] = React.useState<COUNTRY_DATA_TYPE[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<INPUTS>();

  React.useEffect(() => {
    setOptions(
      CountryData.map((data) => {
        return { value: data.code, label: data.name };
      })
    );
  }, []);

  const onSubmit = (data: INPUTS) => {
    let newData = { ...data, country: data.country.value };
    console.log(newData);
    setUser((user) => {
      const updatedUser = [...user.reverse(), newData].reverse();
      saveToLocalStore(updatedUser);
      return updatedUser;
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{
        modal: "modal",
        closeButton: "closeButton",
      }}
    >
      <div className="mt-5 ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1 ">
            <label htmlFor="" className="text-emerald-500 font-semibold">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name", { required: true })}
              className="bg-[#04364a] text-emerald-500 rounded-md outline-none border-emerald-900 p-2 border-[1px]"
            />
            {errors.name?.type == "required" && (
              <ErrorComponent message="name is required" />
            )}
          </div>
          <div className="flex flex-col gap-1 ">
            <label htmlFor="" className="text-emerald-500 font-semibold">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: true,
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              })}
              placeholder="john@mail.com"
              className="bg-[#04364a] text-emerald-500 rounded-md outline-none border-emerald-900 p-2 border-[1px]"
            />
            {errors.email?.type == "required" && (
              <ErrorComponent message="email is required" />
            )}
            {errors.email?.type == "pattern" && (
              <ErrorComponent message="email is invalid" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-emerald-500 font-semibold">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="********"
              className="bg-[#04364a]  text-emerald-500 rounded-md outline-none border-emerald-900 p-2 border-[1px]"
            />
            {errors.password?.type == "required" && (
              <ErrorComponent message="password is required" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="" className="text-emerald-500 font-semibold">
              Country
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      background: "#176b87",
                      border: "1px solid #064e3b",
                      color: "#10b981",
                      outline: "2px solid transparent",
                      outlineOffset: "2px",
                      "&:hover": {
                        // Overwrittes the different states of border
                        borderColor: "1px solid #064e3b",
                      },
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#10b981",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#10b981",
                    }),
                    input: (base) => ({
                      ...base,
                      color: "#10b981",
                    }),
                  }}
                />
              )}
            />
            {errors.country?.type == "required" && (
              <ErrorComponent message="country is required" />
            )}
          </div>
          <div className="flex justify-center">
            <button className="border-teal-600 border-[1px] px-7 text-teal-500 font-bold py-2 rounded-full">
              INSERT
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function ErrorComponent({ message }: { message: string }) {
  return (
    <>
      <span className="text-red-500 font-bold text-sm tracking-wider">
        {message}{" "}
      </span>
    </>
  );
}
