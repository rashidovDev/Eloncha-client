import React from "react";

const About: React.FC = () => {
  return (
    <div className="container mx-auto py-10 space-y-6">

      <h1 className="text-3xl font-bold text-gray-900">
        О нашей платформе
      </h1>

      <p className="text-gray-600 leading-relaxed">
        Добро пожаловать на платформу объявлений о продаже автомобилей в Корее — 
        здесь покупатели и продавцы легко находят друг друга, общаются напрямую 
        и совершают сделки безопасно и удобно.
      </p>

      <p className="text-gray-600 leading-relaxed">
        Мы создаём современное онлайн-пространство, где пользователи могут 
        размещать объявления, просматривать предложения и связываться 
        друг с другом в режиме реального времени. 
        Наша цель — сделать процесс покупки и продажи автомобиля 
        максимально прозрачным, простым и надёжным.
      </p>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-primary mb-2">
            Что мы предлагаем
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Площадка для покупки и продажи автомобилей в Корее</li>
            <li>Прямое общение между продавцом и покупателем</li>
            <li>Проверенные профили пользователей</li>
            <li>Удобный поиск и фильтрация</li>
            <li>Галерея фотографий объявлений</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-lg font-semibold text-primary mb-2">
            Наша миссия
          </h2>
          <p className="text-gray-600">
            Мы стремимся создать надёжную экосистему для онлайн-продажи автомобилей,
            где каждый может принимать уверенные решения. 
            Наша миссия — обеспечить безопасность, прозрачность и комфорт 
            для всех участников платформы.
          </p>
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <h3 className="text-lg font-semibold mb-2">Почему выбирают нас?</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Ориентация на корейский рынок</li>
          <li>Простой и понятный интерфейс</li>
          <li>Быстрые сообщения между пользователями</li>
          <li>Защита персональных данных</li>
          <li>Сообщество надёжных продавцов</li>
        </ul>
      </div>

    </div>
  );
};

export default About;
