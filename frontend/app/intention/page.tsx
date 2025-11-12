"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("Email inválido"),
    phone: z.string().min(11, "Telefone inválido"),
    message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export default function Intention() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    async function onSubmit(data: any) {
        try {
            const res = await fetch("http://localhost:3001/intention", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setToast({ message: "Intenção enviada com sucesso!", type: "success" });
                reset();
            } else {
                const err = await res.json();
                setToast({ message: err.message || "Erro ao enviar intenção.", type: "error" });
            }
        } catch (error) {
            setToast({ message: "Erro de conexão com o servidor.", type: "error" });
        }
    }

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <div className="relative">
            {toast && (
                <div
                    className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-md text-white transition-all duration-500 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"
                        }`}
                >
                    {toast.message}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-md mx-auto">
                <input {...register("name")} placeholder="Nome" className="border p-2 rounded" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                <input {...register("email")} placeholder="Email" className="border p-2 rounded" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <input {...register("phone")} placeholder="Telefone" className="border p-2 rounded" />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

                <textarea {...register("message")} placeholder="Mensagem" className="border p-2 rounded h-24" />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
