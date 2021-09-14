<template>
    <main>
        <header class="top-nav">
            <figure
                @click="
                    $router.push('/');
                    request([], true);
                "
                style="cursor: pointer"
            >
                <img
                    :src="require('@/assets/aws-branco.png')"
                    alt="Categorias amazon"
                />Login
            </figure>

            <input
                v-model="inputToken"
                id="validateToken"
                type="text"
                placeholder="Token de acesso"
                @focus="inputIsFocused = true"
                @blur="inputIsFocused = false"
                @keyup="validateToken($event)"
            />

            <div class="text-center mt font-sm" style="height: 24px">
                <template v-if="inputIsFocused"
                    >Pressione ENTER para pesquisar</template
                >
            </div>
        </header>
    </main>
</template>

<script>
import axios from "axios";

export default {
    name: "Login",

    data: () => ({
        inputToken: "",
        inputIsFocused: false,
        tokenLocal: "",
    }),
    mouted() {
        this.tokenLocal = window.localStorage.getItem("inputToken");
        if (this.tokenLocal)
            this.$router.push(`http://localhost:3333?token=${this.inputToken}`);
    },
    methods: {
        async validateToken(event) {
            if (event.code !== "Enter") {
                return;
            }

            event.preventDefault();

            window.localStorage.setItem("inputToken", this.inputToken);
            
            const { data } = await axios.get(
                `http://localhost:3333/verify-token?token=${this.inputToken}`
            );

            if (data.isValid) {
                this.$vToastify.success("Sucesso");
                this.$router.push("/categorias");
            } else {
                this.$vToastify.error("Token inválido");
            }

            return;
        },
    },
};
</script>
