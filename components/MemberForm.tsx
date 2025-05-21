'use client';

import { useState } from "react";
import { signOutAction } from "@/app/actions";
import { pachProfile } from "@/app/actions";

export default function MemberForm({ userData }: any) {
  const [username, setUsername] = useState(userData?.UserName || "");
  const [firstName, setFirstName] = useState(userData?.FirstName || "");
  const [lastName, setLastName] = useState(userData?.LastName || "");
  const [phone, setPhone] = useState(userData?.PhoneNumber || "");
  const [address, setAddress] = useState(userData?.Address || "");
  const [birthDate, setBirthDate] = useState(userData?.BirthDate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, firstName, lastName, address, birthDate });
  };

  const handleModify = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!userData?.user_id) {
    console.error("UUID de l'utilisateur manquant !");
    return;
  }

  await pachProfile(userData.user_id, username, firstName, lastName, phone, address, birthDate);
};

  return (
    <div className="font-fascinate container flex flex-col justify-center items-center">
      <h1 className="text-white text-[50px]">Profil</h1>
      <p className="text-white">Modifiez votre profil</p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-start items-center w-full max-w-md gap-4"
      >
        <div className="w-full">
          <label htmlFor="Username" className="text-white block mb-1 font-medium">
            Username :
          </label>
          <input
            id="Username"
            name="username"
            type="text"
            className="w-full p-2 border rounded text-gray-800"
            placeholder={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="FirstName" className="text-white block mb-1 font-medium">
            First Name :
          </label>
          <input
            id="FirstName"
            name="firstName"
            type="text"
            className="w-full p-2 border rounded text-gray-800"
            placeholder={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="LastName" className="text-white block mb-1 font-medium">
            Last Name :
          </label>
          <input
            id="LastName"
            name="lastName"
            type="text"
            className="w-full p-2 border rounded text-gray-800"
            placeholder={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="phone" className="text-white block mb-1 font-medium">
            Phone number :
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            className="w-full p-2 border rounded text-gray-800"
            placeholder={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="Address" className="text-gray-80 block mb-1 font-medium">
            Address :
          </label>
          <input
            id="Address"
            name="address"
            type="text"
            className="w-full p-2 border rounded"
            placeholder={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label htmlFor="BirthDate" className="text-white block mb-1 font-medium">
            Year of Birth :
          </label>
          <input
            id="BirthDate"
            name="birthDate"
            type="date"
            className="w-full p-2 border rounded text-gray-800"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

       <div className="flex justify-between w-full">
         <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleModify}
          >
            Mofify
          </button>

          <button
            onClick={signOutAction}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
       </div>
      </form>
    </div>
  );
}
