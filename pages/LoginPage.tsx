import React, { useState } from "react";
import type { User } from "../types";

interface LoginPageProps {
  onLogin: (role: User["role"]) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const emailLower = email.toLowerCase();

      if (emailLower === "kaprodi@example.com") {
        onLogin("kaprodi");
      } else if (emailLower === "baa@example.com") {
        onLogin("baa");
      } else if (emailLower === "dekan@example.com") {
        onLogin("dekan");
      } else {
        onLogin("mahasiswa");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleCreateAccountClick = () => {
    alert('Fitur "Buat Akun" sedang dalam pengembangan.');
  };

  return (
   <main
  className="min-h-screen bg-[#0f1e2c] bg-no-repeat bg-center flex items-center justify-center"
  style={{
    backgroundImage: "url('/bg-ocr.png')",
    backgroundSize: "55%",
  }}
>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <img
                src="https://unai.edu/wp-content/uploads/2023/09/Logo-Unai.png"
                alt="Logo UNAI"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-3xl font-bold text-slate-800">
                U-<span className="text-indigo-600">Convert</span>
              </h1>
            </div>

            <p className="text-slate-500">Sistem Konversi Nilai Matakuliah</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mahasiswa@example.com"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Gunakan password apa saja"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mt-2 text-xs text-slate-500 space-y-1">
                <p className="font-semibold">Demo Login:</p>
                <p>Mahasiswa: <span className="font-mono bg-slate-100 px-1 rounded">mahasiswa@example.com</span></p>
                <p>Kaprodi: <span className="font-mono bg-slate-100 px-1 rounded">kaprodi@example.com</span></p>
                <p>BAA: <span className="font-mono bg-slate-100 px-1 rounded">baa@example.com</span></p>
                <p>Dekan: <span className="font-mono bg-slate-100 px-1 rounded">dekan@example.com</span></p>
                <p className="text-slate-400 italic">Password: apa saja</p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center" />
          {/* <p className="text-sm text-slate-600">
              Belum punya akun?{" "}
              <button
                onClick={handleCreateAccountClick}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Buat Akun
              </button>
            </p>
          </div> */}
        </div>
      </div>
    </main>
  );
};
