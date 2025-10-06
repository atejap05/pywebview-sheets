"""
Modelos de dados para o sistema de gerenciamento
"""
from dataclasses import dataclass
from typing import List, Optional
import re

@dataclass
class User:
    """Modelo para usuários"""
    name: str
    cpf: str
    email: str
    row_index: Optional[int] = None
    
    def __post_init__(self):
        """Validação básica dos dados"""
        if not self.name or len(self.name.strip()) < 2:
            raise ValueError("Nome deve ter pelo menos 2 caracteres")
        
        if not self._is_valid_cpf(self.cpf):
            raise ValueError("CPF inválido")
        
        if not self._is_valid_email(self.email):
            raise ValueError("Email inválido")
    
    def _is_valid_cpf(self, cpf: str) -> bool:
        """Valida CPF básico"""
        cpf = re.sub(r'[^0-9]', '', cpf)
        return len(cpf) == 11
    
    def _is_valid_email(self, email: str) -> bool:
        """Valida email básico"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def to_dict(self) -> dict:
        """Converte para dicionário"""
        return {
            'name': self.name,
            'cpf': self.cpf,
            'email': self.email,
            'row_index': self.row_index
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'User':
        """Cria instância a partir de dicionário"""
        return cls(
            name=data['name'],
            cpf=data['cpf'],
            email=data['email'],
            row_index=data.get('row_index')
        )

@dataclass
class Product:
    """Modelo para produtos"""
    name: str
    price: float
    description: str
    row_index: Optional[int] = None
    
    def __post_init__(self):
        """Validação básica dos dados"""
        if not self.name or len(self.name.strip()) < 2:
            raise ValueError("Nome do produto deve ter pelo menos 2 caracteres")
        
        if self.price < 0:
            raise ValueError("Preço não pode ser negativo")
        
        if not self.description or len(self.description.strip()) < 5:
            raise ValueError("Descrição deve ter pelo menos 5 caracteres")
    
    def to_dict(self) -> dict:
        """Converte para dicionário"""
        return {
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'row_index': self.row_index
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Product':
        """Cria instância a partir de dicionário"""
        return cls(
            name=data['name'],
            price=float(data['price']),
            description=data['description'],
            row_index=data.get('row_index')
        )
