import React from "react";
import { Mail, Phone, MapPin } from "react-feather";

const Footer: React.FC = () => {
  return (
<footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-10">

        {/* БРЕНД */}
        <div>
          <h2 className="text-xl font-bold text-primary">Eloncha</h2>
          <p className="mt-3 text-gray-600 text-sm leading-relaxed">
            Платформа для покупки и продажи автомобилей в Южной Корее. 
            Связывайтесь напрямую с продавцами и находите подходящий автомобиль быстрее.
          </p>
        </div>

        {/* НАВИГАЦИЯ */}
        <div className="md:block hidden">
          <h3 className="font-semibold mb-3">Навигация</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-primary cursor-pointer">Главная</li>
            <li className="hover:text-primary cursor-pointer">Объявления</li>
            <li className="hover:text-primary cursor-pointer">Избранное</li>
            <li className="hover:text-primary cursor-pointer">Сообщения</li>
          </ul>
        </div>

        {/* ПОМОЩЬ */}
        <div className="md:block hidden">
          <h3 className="font-semibold mb-3">Поддержка</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="hover:text-primary cursor-pointer">Центр помощи</li>
            <li className="hover:text-primary cursor-pointer">Советы по безопасности</li>
            <li className="hover:text-primary cursor-pointer">Пользовательское соглашение</li>
            <li className="hover:text-primary cursor-pointer">Политика конфиденциальности</li>
          </ul>
        </div>

        {/* КОНТАКТЫ */}
        <div>
          <h3 className="font-semibold mb-3">Контакты</h3>
          <div className="space-y-2 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+82 10 7538 2787 </span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>elonchakoreagmail.com</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Сеул, Южная Корея</span>
            </div>

          </div>
        </div>

      </div>

      {/* НИЖНЯЯ ПОЛОСА */}
      <div className="border-t text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Eloncha. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;
