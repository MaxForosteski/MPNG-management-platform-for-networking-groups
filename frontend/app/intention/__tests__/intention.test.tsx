import { fireEvent, getByPlaceholderText, render, screen, waitFor } from '@testing-library/react';
import Intention from '../page';

test("Render form fields", () => {
    render(<Intention />);

    expect(screen.getByPlaceholderText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name:/Enviar/i })).toBeInTheDocument();
});

test("Show validation error on send empty form fields", async () => {
    render(<Intention />)

    const button = screen.getByRole("button", { name:/Enviar/i });
    fireEvent.click(button);

    await waitFor(() => {
        expect(screen.getByText(/Nome deve ter pelo menos 3 caracteres/i)).toBeInTheDocument();
        expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
        expect(screen.getByText(/Telefone inválido/i)).toBeInTheDocument();
        expect(screen.getByText(/Mensagem deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
    })
})

test("show toast on success", async () => {
    global.fetch = jest.fn(() => 
        Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    ) as jest.Mock;

    render(<Intention />)
    fireEvent.change(screen.getByPlaceholderText(/Nome/i), { target: { value: "Jonh Doe"}});
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "jonhdoe@gmail.com"} });
    fireEvent.change(screen.getByPlaceholderText(/Telefone/i), { target: { value: "12345678910" } });
    fireEvent.change(screen.getByPlaceholderText(/Mensagem/i), { target: { value: "Olá, tudo bem?"}});

    fireEvent.click(screen.getByRole("button", { name: /Enviar/i }));

    await waitFor(() => {
        expect(screen.getByText(/Intenção enviada com sucesso!/i)).toBeInTheDocument();
    });
});

test("show toast on error" , async () => {
    global.fetch = jest.fn(() => 
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ message: "Erro ao salvar intenção."}),
        })
    ) as jest.Mock;

    render(<Intention />)

    fireEvent.change(screen.getByPlaceholderText(/Nome/i), { target: { value: "Jonh Doe"}});
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "jonhdoe@gmail.com"} });
    fireEvent.change(screen.getByPlaceholderText(/Telefone/i), { target: { value: "12345678910" } });
    fireEvent.change(screen.getByPlaceholderText(/Mensagem/i), { target: { value: "Olá, tudo bem?"}});

    fireEvent.click(screen.getByRole("button", { name: /Enviar/i }));

    await waitFor(() => {
        expect(screen.getByText(/Erro ao salvar intenção./i)).toBeInTheDocument();
    });
});