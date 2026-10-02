"use client";

import { type FormEvent } from "react";

export default function ContactForm() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        alert("¡Enviado!");
        form.reset();
      }
    } catch (error) {
      console.error("No se pudo enviar el formulario de contacto.", error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='news-card grid gap-6 p-8'>
      <input
        type='hidden'
        name='access_key'
        value='74baae1a-d4db-41e1-a29c-8b7e936794de'
      />
      <input type='hidden' name='subject' value='Mensaje de ActualNow' />
      <input
        type='checkbox'
        name='botcheck'
        className='hidden'
        style={{ display: "none" }}
      />

      <div>
        <label className='block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500'>
          Nombre
        </label>
        <input
          type='text'
          name='name'
          required
          className='w-full bg-black border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-sky-500 text-white transition'
          placeholder='Tu nombre'
        />
      </div>
      <div>
        <label className='block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500'>
          Email
        </label>
        <input
          type='email'
          name='email'
          required
          className='w-full bg-black border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-sky-500 text-white transition'
          placeholder='tu@email.com'
        />
      </div>
      <div>
        <label className='block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500'>
          Mensaje
        </label>
        <textarea
          name='message'
          required
          className='w-full bg-black border border-zinc-800 p-3 rounded-lg h-32 focus:outline-none focus:border-sky-500 text-white transition resize-none'
          placeholder='¿En qué podemos ayudarte?'
        ></textarea>
      </div>
      <button type='submit' className='news-button w-full py-3'>
        Enviar Formulario
      </button>
    </form>
  );
}
