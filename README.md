# Avaliação Prática de DevOps – Cadastro de Livros

## Integrantes

- Caio Henrique Sibrão da Cruz  RA:23000666
- Murilo Nogueira Avarino       RA: 24000605
- Juan Pablo Souza de Melo      RA: 26001888

## Objetivo

Desenvolver uma aplicação distribuída para cadastro e consulta de livros, utilizando práticas e ferramentas de DevOps.

## Tecnologias utilizadas

- Node.js
- Express
- MySQL
- HTML, CSS e JavaScript
- Docker
- Docker Compose
- OpenTofu
- Ansible
- Cloud-init
- KVM/libvirt
- GitHub

## Arquitetura

- VM1: aplicação web executada em um container Nginx.
- VM2: API REST Node.js e banco de dados MySQL.
- Comunicação entre as máquinas através de HTTP.

## Endpoints

- POST /livro — Cadastrar livro.
- GET /livros — Listar livros.
- GET /health — Verificar disponibilidade da API.

## Provisionamento da infraestrutura

```bash
cd iac
tofu init
tofu validate# Avaliacao_Devops
Avaliação Prática de Devops - Cadastro de Livros

CAIO HENRIQUE SIBRÃO DA CRUZ       RA:23000666
MURILO NOGUEIRA AVARINO             RA: 24000605
JUAN PABLO DE SOUZA MELO            RA: 26001888
tofu apply
```

## Implantação da aplicação

Na raiz do projeto, configure os endereços das VMs no inventário e execute:

```bash
ansible-playbook -i ansible/inventory ansible/playbook.yml
```

## Endereço da aplicação

http\://IP_DA_VM1

## Funcionalidades

- Cadastro de livros.
- Listagem de livros.
- Armazenamento persistente no MySQL.
- Provisionamento de infraestrutura.
- Automação da implantação.

