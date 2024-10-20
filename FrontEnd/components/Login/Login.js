import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';

export default function Registro() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleCadastro = async () => {

        if (!email || !senha) {
            Alert.alert('Erro', 'Por favor, preencha ambos os campos');
            return;
        }

        try {
            const response = await fetch('http://192.168.0.106:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.text();

            if (response.ok) {
                Alert.alert('Sucesso', data);
            } else {
                Alert.alert('Erro', data);
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível conectar ao servidor');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Pagina para logar</Text>
            <TextInput
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 20, borderBottomWidth: 1, padding: 10 }}
            />
            <TextInput
                placeholder="Digite sua senha"
                value={senha}
                secureTextEntry
                onChangeText={setSenha}
                style={{ marginBottom: 20, borderBottomWidth: 1, padding: 10 }}
            />
            <Button title="Login" onPress={handleCadastro} />
        </View>
    );
}
