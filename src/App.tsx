/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  GraduationCap, 
  Users, 
  Trophy, 
  ChevronRight, 
  Home, 
  BookOpen, 
  Globe, 
  Gamepad2, 
  Lightbulb, 
  Map, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Compass,
  Briefcase,
  User,
  Star,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ModuleId, UserState, Achievement, Question } from './types';
import { QUESTIONS, ACHIEVEMENTS, EDUCATION_CARDS } from './data';

// --- Components ---

const ProgressBar = ({ value, max }: { value: number; max: number }) => (
  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${(value / max) * 100}%` }}
      className="h-full bg-indigo-400"
    />
  </div>
);

const ModuleLayout = ({ title, children, onNext, showNext = true }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="max-w-4xl mx-auto py-8"
  >
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white relative z-10">{title}</h2>
      <div className="relative z-10 min-h-[400px]">
        {children}
      </div>
      {showNext && (
        <div className="mt-12 flex justify-end relative z-10">
          <button onClick={onNext} className="btn-primary">
            Продовжити <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  </motion.div>
);

export default function App() {
  // --- State ---
  const [currentModule, setCurrentModule] = useState<ModuleId>('home');
  const [gameState, setGameState] = useState<UserState>(() => {
    const saved = localStorage.getItem('edu_progress');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      completedModules: [],
      achievements: [],
      name: '',
      goal: ''
    };
  });
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('edu_progress', JSON.stringify(gameState));
  }, [gameState]);

  // --- Actions ---
  const addXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      if (newLevel > prev.level) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const unlockAchievement = (id: string) => {
    if (gameState.achievements.includes(id)) return;
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (achievement) {
      setGameState(prev => ({ ...prev, achievements: [...prev.achievements, id] }));
      setShowAchievement(achievement);
      setTimeout(() => setShowAchievement(null), 4000);
    }
  };

  const completeModule = (id: ModuleId) => {
    if (!gameState.completedModules.includes(id)) {
      setGameState(prev => ({ ...prev, completedModules: [...prev.completedModules, id] }));
      addXP(50);
    }
  };

  // --- Rendering Helpers ---
  const nextModule = (next: ModuleId) => {
    completeModule(currentModule);
    setCurrentModule(next);
    window.scrollTo(0, 0);
  };

  // --- Module Components ---

  const HomeModule = () => (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-24 relative z-10">
      <motion.div
        initial={{ rotate: -10, scale: 0 }}
        animate={{ rotate: 10, scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="mb-8 p-6 bg-indigo-500/20 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md"
      >
        <Compass size={80} className="text-indigo-400" />
      </motion.div>
      <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
        Траєкторія Успіху
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mb-12">
        Ласкаво просимо! Дізнайся як змінити світ навколо себе та розкрити власний потенціал через освіту та громадську активність.
      </p>
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => {
            if (!gameState.achievements.includes('start')) {
              unlockAchievement('start');
            }
            nextModule('welfare');
          }} 
          className="btn-primary text-xl px-12 py-5 cursor-pointer"
        >
          Розпочати навчання <ChevronRight />
        </button>
      </div>
    </div>
  );

  const WelfareModule = () => {
    const [active, setActive] = useState<string | null>(null);
    const elements = [
      { id: 'edu', title: 'Освіта', icon: GraduationCap, desc: 'Доступ до знань для кожного' },
      { id: 'med', title: 'Медицина', icon: Heart, desc: 'Якісна охорона здоров’я' },
      { id: 'dev', title: 'Розвиток', icon: Lightbulb, desc: 'Можливості для самореалізації' },
      { id: 'cult', title: 'Культура', icon: Users, desc: 'Участь у соціокультурному житті' }
    ];

    return (
      <ModuleLayout title="Що таке Громадський Добробут?" onNext={() => nextModule('realization')}>
        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
          Громадський добробут — це не лише економіка. Це комплексна система, яка базується на двох великих колонах: <strong>Якості життя</strong> та <strong>Способі життя</strong>. Крім того, це стан суспільства, за якого кожен громадянин має реальну можливість для всебічного розвитку.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="glass-card bg-indigo-500/5">
            <h4 className="text-xl font-bold text-indigo-400 mb-4 flex items-center gap-2">
              <Star className="text-indigo-400" size={20} /> Якість життя
            </h4>
            <div className="space-y-4">
              <div onClick={() => setActive('health')} className={`p-4 rounded-2xl cursor-pointer border transition-all ${active === 'health' ? 'bg-indigo-500/20 border-indigo-400' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                <span className="font-bold block">Рівень життя</span>
                <span className="text-sm text-slate-400">Доходи, соціальний захист, медицина та освіта. Без цього неможливий базовий комфорт.</span>
              </div>
              <div onClick={() => setActive('env')} className={`p-4 rounded-2xl cursor-pointer border transition-all ${active === 'env' ? 'bg-indigo-500/20 border-indigo-400' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                <span className="font-bold block">Умови життя</span>
                <span className="text-sm text-slate-400">Екологія, санітарні норми, психологічна атмосфера. Те, що ми відчуваємо щодня.</span>
              </div>
            </div>
          </div>

          <div className="glass-card bg-emerald-500/5">
            <h4 className="text-xl font-bold text-secondary-400 mb-4 flex items-center gap-2">
              <Heart className="text-secondary-400" size={20} /> Спосіб життя
            </h4>
            <div className="space-y-4">
              <div onClick={() => setActive('activity')} className={`p-4 rounded-2xl cursor-pointer border transition-all ${active === 'activity' ? 'bg-emerald-500/20 border-emerald-400' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                <span className="font-bold block">Діяльність</span>
                <span className="text-sm text-slate-400">Навчання, праця, розвиток творчих здібностей. Твій внесок у світ.</span>
              </div>
              <div onClick={() => setActive('vol')} className={`p-4 rounded-2xl cursor-pointer border transition-all ${active === 'vol' ? 'bg-emerald-500/20 border-emerald-400' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                <span className="font-bold block">Активність</span>
                <span className="text-sm text-slate-400">Стиль життя, волонтерство та гнучкість методів праці. Свідомий вибір дій.</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 bg-white/5 rounded-3xl border border-white/10 shadow-xl"
            >
              <h4 className="text-2xl font-bold text-white mb-4">
                {active === 'health' && "Приклад: Доступна та сучасна інфраструктура"}
                {active === 'env' && "Приклад: Екологія та Дузшевне Дозвілля"}
                {active === 'activity' && "Приклад: Професійне зростання та освіта"}
                {active === 'vol' && "Приклад: Соціальна згуртованість"}
              </h4>
              <div className="text-lg text-slate-300 leading-relaxed space-y-4">
                {active === 'health' && (
                  <>
                    <p>Це коли в селі чи місті працює сучасна амбулаторія, а школа забезпечена ноутбуками та швидким інтернетом. Громада інвестує в те, щоб ти міг вчитися в комфорті.</p>
                    <div className="p-4 bg-indigo-500/10 border-l-4 border-indigo-400 text-sm italic">Факт: Країни з найвищим індексом добробуту витрачають до 20% бюджету на освіту.</div>
                  </>
                )}
                {active === 'env' && (
                  <>
                    <p>Парки, чисте повітря, безпечні тротуари та доброзичлива атмосфера. Коли ти можеш гуляти ввечері без страху — це показник високого добробуту.</p>
                    <p>Відсутність булінгу в школі — це також частина екології твого життя.</p>
                  </>
                )}
                {active === 'activity' && (
                  <>
                    <p>Можливість займатися спортом, відвідувати музичну школу чи гурток робототехніки. Самореалізація — це перетворення твого потенціалу в реальні досягнення.</p>
                    <div className="flex gap-4 items-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <Gamepad2 className="text-emerald-400 shrink-0" />
                      <span className="text-sm">Громадський добробут зростає, коли кожен знаходить своє покликання.</span>
                    </div>
                  </>
                )}
                {active === 'vol' && (
                  <>
                    <p>Коли люди об'єднуються для розв'язання спільних проблем (толоки, допомога ЗСУ, захист прав тварин). Це створює «соціальний капітал» — довіру між людьми.</p>
                    <p>Довіра в громаді дозволяє швидше впроваджувати зміни та підтримувати кожного у скрутну хвилину.</p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModuleLayout>
    );
  };

  const RealizationModule = () => {
    const opportunities = [
      { 
        id: '1', 
        type: 'Освіта та навчання', 
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        examples: 'Створення центрів позашкільної освіти, доступні онлайн-курси, шкільні наукові товариства.',
        impact: 'Підготовка майбутніх професіоналів та розвиток інтелекту громади.'
      },
      { 
        id: '2', 
        type: 'Культура та творчість', 
        color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        examples: 'Мистецькі фестивалі, гранти для молодих талантів, музичні школи, театральні студії.',
        impact: 'Формування національної ідентичності та естетичне виховання.'
      },
      { 
        id: '3', 
        type: 'Спорт та активний відпочинок', 
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        examples: 'Будівництво стадіонів, організація спортивних змагань, велодоріжки, тренажери у парках.',
        impact: 'Популяризація здорового способу життя та командного духу.'
      },
      { 
        id: '4', 
        type: 'Підприємництво та кар’єра', 
        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        examples: 'Підтримка стартапів, тренінги з фінансової грамотності, бізнес-інкубатори для підлітків.',
        impact: 'Економічна незалежність та розвиток інноваційного мислення.'
      }
    ];
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <ModuleLayout title="Можливості для самореалізації" onNext={() => nextModule('roles')}>
        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
          Сучасна громада — це простір можливостей. Вона повинна створювати умови, де кожен може знайти свій шлях. Обирай категорію, щоб побачити приклади та їх вплив на твій розвиток:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {opportunities.map(opt => (
            <div
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`p-6 rounded-2xl border backdrop-blur-md transition-all cursor-pointer ${
                selected === opt.id ? 'scale-[1.02] ring-2 ring-primary-500 ' + opt.color.replace('20', '40') : 'bg-white/5 border-white/10 hover:bg-white/10 ' + opt.color.replace('bg-', 'text-').replace('text-', '')
              }`}
            >
              <span className="font-bold text-lg block mb-2">{opt.type}</span>
              <p className={`text-sm ${selected === opt.id ? 'text-white' : 'text-slate-500'}`}>Натисни, щоб дізнатися більше</p>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 bg-indigo-500/10 border border-indigo-500/30 rounded-3xl space-y-6"
            >
              <div>
                <h5 className="text-2xl font-bold text-indigo-300 mb-2">Конкретні приклади:</h5>
                <p className="text-xl text-slate-200 leading-relaxed italic">
                  «{opportunities.find(o => o.id === selected)?.examples}»
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h6 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-1">Чому це важливо?</h6>
                <p className="text-slate-300">{opportunities.find(o => o.id === selected)?.impact}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-indigo-400">
                <Lightbulb size={20} />
                <span className="text-sm">Порада: використовуй щонайменше 2 різні можливості щороку для різнобічного розвитку.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModuleLayout>
    );
  };

  const RolesModule = () => {
    const roles = [
      {
        id: 1,
        title: "Доброзичливість",
        desc: "Допомагаємо одне одному у складних моментах, надаємо підтримку і проявляємо співчуття. Це зміцнює наші зв’язки та робить нас сильнішими як спільноту.",
        icon: Heart
      },
      {
        id: 2,
        title: "Відповідальність за довкілля",
        desc: "Активно займаємося сортуванням сміття, мінімізуємо використання пластику, захищаємо природу через екологічні ініціативи.",
        icon: Globe
      },
      {
        id: 3,
        title: "Допомога іншим",
        desc: "Волонтерство та благодійність демонструють готовність допомагати тим, хто цього потребує. Це поширює ланцюжок добра та емпатії.",
        icon: Users
      },
      {
        id: 4,
        title: "Толерантність",
        desc: "Приймаємо різноманітність у нашому суспільстві. Поважаємо людей із різними культурними та соціальними переконаннями.",
        icon: Star
      },
      {
        id: 5,
        title: "Ініціативність",
        desc: "Стимулюємо позитивні зміни у школі: обговорюємо та впроваджуємо навчальні, екологічні та спортивні проекти.",
        icon: Lightbulb
      }
    ];

    const scenarios = [
      {
        id: 1,
        title: "Ситуація у школі",
        text: "Твій однокласник потребує допомоги з математикою, але ти поспішаєш на тренування.",
        options: [
          { text: "Пробігти мимо", score: 0 },
          { text: "Допомогти 10 хв, потім піти", score: 10 },
          { text: "Запропонувати пояснити ввечері онлайн", score: 20 }
        ]
      },
      {
        id: 2,
        title: "Довкілля",
        text: "Ти бачиш, що хтось залишив пластикову пляшку на спортивному майданчику.",
        options: [
          { text: "Не звернути уваги", score: 0 },
          { text: "Викинути у найближчий смітник", score: 20 },
          { text: "Обуритися в голос і піти", score: 5 }
        ]
      }
    ];
    const [step, setStep] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [showScenarios, setShowScenarios] = useState(false);

    return (
      <ModuleLayout title="Яка твоя роль як учня?" onNext={() => {
        if (!showScenarios) {
          setShowScenarios(true);
        } else {
          addXP(totalScore);
          nextModule('education');
        }
      }} showNext={step >= scenarios.length || !showScenarios}>
        {!showScenarios ? (
          <div>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Як учень, ти маєш величезний вплив на оточуючих. Твоя поведінка формує обличчя твоєї школи та громади:
            </p>
            <div className="grid gap-4">
              {roles.map(role => (
                <div key={role.id} className="glass-card flex items-start gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <role.icon size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{role.id}. {role.title}</h5>
                    <p className="text-sm text-slate-400">{role.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-indigo-300 font-bold animate-pulse">
              Далі — перевіримо твої дії в реальних ситуаціях...
            </div>
          </div>
        ) : step < scenarios.length ? (
          <div className="relative z-10">
            <span className="text-indigo-400 font-bold mb-2 block uppercase tracking-widest text-sm">{scenarios[step].title}</span>
            <p className="text-xl mb-8 font-medium text-white">{scenarios[step].text}</p>
            <div className="flex flex-col gap-4">
              {scenarios[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTotalScore(prev => prev + opt.score);
                    setStep(prev => prev + 1);
                  }}
                  className="p-6 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all font-bold">
                      {i + 1}
                    </div>
                    <span className="text-slate-200">{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle2 size={64} className="text-emerald-400 mx-auto mb-6" />
            <h4 className="text-3xl font-bold mb-4">Ти впорався з викликами!</h4>
            <p className="text-xl text-slate-300">Твій вибір демонструє готовність бути активним членом громади.</p>
            <p className="text-indigo-400 text-2xl font-bold mt-4">+ {totalScore} XP нараховано!</p>
          </div>
        )}
      </ModuleLayout>
    );
  };

  const EducationModule = () => {
    const categories = [
      {
        id: 'dist',
        title: 'Дистанційна освіта',
        desc: 'Навчання за допомогою ІТ-технологій та Інтернету. Дає гнучкість у часі та місці.',
        examples: 'Платформи на кшталт Coursera, закриті шкільні портали, вебінари та інтерактивні тести.'
      },
      {
        id: 'inc',
        title: 'Інклюзивна освіта',
        desc: 'Забезпечення права всіх дітей на освіту, включаючи дітей з особливими потребами, у звичайних закладах.',
        examples: 'Адаптовані програми, асистенти вчителів, спеціально обладнані класи та інклюзивні ресурсні центри.'
      },
      {
        id: 'extra',
        title: 'Позашкільна освіта',
        desc: 'Навчання поза межами шкільної програми. Сприяє всебічному розвитку особистості.',
        examples: 'Музичні школи, спортивні секції, табори, гуртки робототехніки та малювання.'
      },
      {
        id: 'self',
        title: 'Самоосвіта',
        desc: 'Свідомий пошук нових знань без зовнішнього контролю. Основа пожиттєвого навчання (Lifelong learning).',
        examples: 'Читання наукової літератури, вивчення мов через додатки, перегляд освітніх YouTube-каналів.'
      }
    ];

    return (
      <ModuleLayout title="Різноманіття освіти" onNext={() => nextModule('importance')}>
        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
          У сучасному світі освіта перестала бути статичною. Вона адаптується до потреб кожного. Досліди різні форми отримання знань:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="glass-card glass-card-hover group">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg shadow-indigo-500/20">
                <Star size={24} className="text-indigo-400 group-hover:text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">{cat.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{cat.desc}</p>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-indigo-300">
                <span className="font-bold uppercase tracking-widest block mb-1">Приклад:</span>
                {cat.examples}
              </div>
            </div>
          ))}
        </div>
      </ModuleLayout>
    );
  };

  const ImportanceModule = () => (
    <ModuleLayout title="Чому освіта важлива?" onNext={() => nextModule('tasks')}>
      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        Освіта — це не просто отримання оцінок. Це стратегічний інструмент, який змінює долю цілих народів та окремих людей. Вона є фундаментом для критичного мислення та відповідального громадянства.
      </p>
      
      <div className="space-y-8 mb-12">
        <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={120} /></div>
          <h4 className="text-2xl font-bold mb-4 relative z-10 text-indigo-300">🌍 Вплив освіти на суспільство</h4>
          <p className="text-slate-300 leading-relaxed mb-6">
            Висока якість шкільної освіти є фундаментом для інновацій. Коли кожен член громади має доступ до знань, це стимулює технологічний прогрес та створює нові робочі місця. Освічена громада — це успішна громада.
          </p>
          <div className="grid gap-4">
            <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/40"><CheckCircle2 size={18} /></div>
              <div>
                <span className="font-bold block text-white text-lg">Розвиток критичного мислення</span>
                <span className="text-slate-400 leading-relaxed">Вміння аналізувати інформацію допомагає протистояти маніпуляціям, фейкам та приймати зважені рішення у власному житті та житті громади.</span>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/40"><CheckCircle2 size={18} /></div>
              <div>
                <span className="font-bold block text-white text-lg">Стимулювання інновацій</span>
                <span className="text-slate-400 leading-relaxed">Технології в медицині, ІТ та енергетиці неможливі без глибокої теоретичної бази та практичних навичок, що здобуваються під час навчання.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card">
            <h4 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Lightbulb className="text-accent-500" /> Соціальна роль
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              «Освіта сприяє зменшенню соціальної нерівності. Вона дає можливість дітям з будь-яким стартовим капіталом досягти успіху завдяки власному розуму та наполегливості.»
            </p>
          </div>
          <div className="glass-card">
            <h4 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Trophy className="text-indigo-400" /> Економічний ефект
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed italic">
              «За статистикою, кожен додатковий рік навчання збільшує майбутній дохід людини в середньому на 10%. Для держави — це зростання ВВП та стабільність бюджету.»
            </p>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );

  const TasksModule = () => {
    const tasks = [
      {
        id: 1,
        title: "Проєкт 'Школа майбутнього'",
        desc: "Сформулюй 3 основні зміни, які б ти вніс у свою школу, щоб вона стала кращим прикладом інклюзивного та сучасного освітнього хабу.",
        difficulty: "Середня",
        type: "Творче завдання"
      },
      {
        id: 2,
        title: "Аналіз громади",
        desc: "Проведи невеличке дослідження: знайди у своїй громаді один об'єкт, який сприяє добробуту, та один, який потребує покращення. Запиши свої аргументи.",
        difficulty: "Висока",
        type: "Дослідження"
      },
      {
        id: 3,
        title: "План самоосвіти",
        desc: "Склади список з 3 тем, які ти хочеш вивчити самостійно протягом наступного місяця. Визнач конкретні ресурси (книги, курси, канали).",
        difficulty: "Легка",
        type: "Практична робота"
      }
    ];

    return (
      <ModuleLayout title="✍️ Завдання для перевірки (Практикум)" onNext={() => nextModule('millionaire')}>
        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
          Теорія без практики — мертва. Спробуй виконати ці завдання, щоб краще засвоїти матеріал та почати змінювати світ навколо себе вже сьогодні.
        </p>

        <div className="space-y-6">
          {tasks.map(task => (
            <div key={task.id} className="glass-card border-l-4 border-l-indigo-500 group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
                  {task.type}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                  Складність: <span className={task.difficulty === 'Висока' ? 'text-red-400' : task.difficulty === 'Середня' ? 'text-yellow-400' : 'text-emerald-400'}>{task.difficulty}</span>
                </span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{task.title}</h4>
              <p className="text-slate-400 leading-relaxed">{task.desc}</p>
              
              <div className="mt-6 flex items-center gap-4">
                <button className="px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-bold border border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition-all">
                  Відкрити чернетку
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 text-center">
          <p className="text-emerald-400 font-bold mb-2">💡 Порада вчителя:</p>
          <p className="text-slate-400 text-sm">Використання цих завдань у школі допоможе створити реальні проєкти, що змінять твій район чи місто.</p>
        </div>
      </ModuleLayout>
    );
  };

  const MillionaireModule = () => {
    const [current, setCurrent] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [lastAnswer, setLastAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    const handleAnswer = (idx: number) => {
      setLastAnswer(idx);
      setShowFeedback(true);
      if (idx === QUESTIONS[current].correct) {
        setScore(prev => prev + 1);
        addXP(20);
      }
    };

    const nextQuestion = () => {
      if (current + 1 < QUESTIONS.length) {
        setCurrent(prev => prev + 1);
        setShowFeedback(false);
        setLastAnswer(null);
      } else {
        setQuizFinished(true);
        if (score >= 12) unlockAchievement('intellectual');
      }
    };

    return (
      <ModuleLayout title="🎓 Експерт-Тест: Громада та Освіта" onNext={() => nextModule('trajectory')} showNext={quizFinished}>
        {!quizFinished ? (
          <div className="flex flex-col gap-6 relative z-10">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl text-white border border-white/10 shadow-2xl">
              <span className="text-indigo-400 font-bold mb-2 block uppercase tracking-widest text-xs">Запитання {current + 1} з {QUESTIONS.length}</span>
              <p className="text-xl font-bold leading-relaxed">{QUESTIONS[current].text}</p>
            </div>

            <div className="grid gap-3">
              {QUESTIONS[current].options.map((opt, i) => {
                const isCorrect = i === QUESTIONS[current].correct;
                const isSelected = i === lastAnswer;
                
                let btnClass = "p-5 border border-white/10 rounded-2xl bg-white/5 transition-all text-left font-medium relative overflow-hidden ";
                if (!showFeedback) {
                  btnClass += "hover:bg-white/10 hover:border-indigo-500/50 cursor-pointer";
                } else {
                  if (isCorrect) btnClass += "border-emerald-500/50 bg-emerald-500/10 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                  else if (isSelected) btnClass += "border-red-500/50 bg-red-500/10 text-red-100";
                  else btnClass += "opacity-50";
                }

                return (
                  <button
                    key={i}
                    disabled={showFeedback}
                    onClick={() => handleAnswer(i)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        showFeedback ? (isCorrect ? 'bg-emerald-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-white/10') : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl"
                >
                  <p className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                    {lastAnswer === QUESTIONS[current].correct ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {lastAnswer === QUESTIONS[current].correct ? "Правильно!" : "Цього разу не зовсім..."}
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {QUESTIONS[current].explanation}
                  </p>
                  <button 
                    onClick={nextQuestion}
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {current + 1 < QUESTIONS.length ? "Наступне питання" : "Переглянути результат"} <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <Award size={100} className="text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
            </motion.div>
            <h4 className="text-4xl font-bold mb-4 text-white">Тест завершено!</h4>
            <div className="text-6xl font-black text-indigo-400 mb-6">{score} / {QUESTIONS.length}</div>
            <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
              {score === QUESTIONS.length ? "Неймовірно! Ти справжній експерт з громадського добробуту!" : 
               score >= 10 ? "Чудовий результат! Твої знання на високому рівні." : 
               "Непогано, але завжди є куди рости. Освіта — це нескінченний шлях!"}
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button onClick={() => { setQuizFinished(false); setCurrent(0); setScore(0); setShowFeedback(false); }} className="btn-secondary">
                Спробувати ще раз
              </button>
            </div>
          </div>
        )}
      </ModuleLayout>
    );
  };

  const TrajectoryModule = () => {
    const goals = [
      { id: 'leader', title: 'Суспільний діяч', icon: Globe, rec: 'Обирай волонтерство та розвивай інклюзивні ініціативи' },
      { id: 'innovator', title: 'Інноватор', icon: Lightbulb, rec: 'Зверни увагу на дистанційну освіту та технологічні курси' },
      { id: 'expert', title: 'Професіонал', icon: Briefcase, rec: 'Використовуй позашкільну освіту та самоосвіту для глибоких знань' }
    ];
    const [selected, setSelected] = useState<string | null>(null);

    return (
      <ModuleLayout title="Моя траєкторія розвитку" onNext={() => nextModule('home')}>
        <p className="text-lg text-slate-400 mb-8">Ким ти бачиш себе у майбутньому? Ми дамо поради для твого старту:</p>
        <div className="grid md:grid-cols-3 gap-6">
          {goals.map(g => (
            <div 
              key={g.id} 
              onClick={() => setSelected(g.id)}
              className={`glass-card glass-card-hover flex flex-col items-center text-center cursor-pointer ${
                selected === g.id ? 'bg-indigo-500/30 border-indigo-500/50 shadow-indigo-500/20 shadow-xl scale-105' : ''
              }`}
            >
              <g.icon size={48} className={`mb-4 ${selected === g.id ? 'text-indigo-300' : 'text-slate-400'}`} />
              <h5 className="text-xl font-bold mb-2 text-white">{g.title}</h5>
              <p className={`text-sm ${selected === g.id ? 'text-indigo-200' : 'text-slate-500'}`}>Натисни, щоб відкрити пораду</p>
            </div>
          ))}
        </div>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-8 bg-indigo-500/10 rounded-3xl border border-indigo-500/30 text-center shadow-xl backdrop-blur-md"
          >
            <h6 className="text-2xl font-bold mb-2 text-indigo-400 uppercase tracking-tighter">Твоя рекомендація:</h6>
            <p className="text-xl text-white font-medium">{goals.find(g => g.id === selected)?.rec}</p>
          </motion.div>
        )}
        {selected && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => {
                unlockAchievement('leader');
                completeModule('trajectory');
                setCurrentModule('home');
                window.scrollTo(0, 0);
              }} 
              className="btn-primary mx-auto"
            >
              Завершити подорож <Trophy />
            </button>
          </div>
        )}
      </ModuleLayout>
    );
  };

  const moduleRenderer = () => {
    switch (currentModule) {
      case 'home': return <HomeModule />;
      case 'welfare': return <WelfareModule />;
      case 'realization': return <RealizationModule />;
      case 'roles': return <RolesModule />;
      case 'education': return <EducationModule />;
      case 'importance': return <ImportanceModule />;
      case 'tasks': return <TasksModule />;
      case 'millionaire': return <MillionaireModule />;
      case 'trajectory': return <TrajectoryModule />;
      default: return <HomeModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col relative overflow-hidden">
      {/* --- Background Blobs --- */}
      <div className="bg-blob top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/30" />
      <div className="bg-blob bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-emerald-600/20" />
      <div className="bg-blob top-[200px] right-[100px] w-[300px] h-[300px] bg-purple-600/20" />

      {/* --- Header --- */}
      <header className="glass-header sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div onClick={() => setCurrentModule('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-all shadow-lg shadow-indigo-500/20">
              G
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">Громадський Добробут</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Рівень {gameState.level}</span>
                <span className="text-sm font-bold text-indigo-400">{gameState.xp % 100} / 100 XP</span>
              </div>
              <div className="w-32">
                <ProgressBar value={gameState.xp % 100} max={100} />
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-8 h-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-900 font-bold">
                {gameState.xp % 100}
              </div>
              <div className="text-sm font-medium">XP</div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Achievement Notification --- */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="achievement-popup text-white"
          >
            <div className="text-4xl">{showAchievement.icon}</div>
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Здобуто досягнення!</div>
              <div className="font-bold text-lg">{showAchievement.title}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* --- Sidebar Navigation (Desktop) --- */}
        {currentModule !== 'home' && (
          <aside className="hidden lg:flex w-64 bg-white/5 backdrop-blur-sm border-r border-white/10 p-6 flex-col gap-2">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-4 tracking-widest">Програма</div>
            {[
              { id: 'welfare', label: '1. Добробут' },
              { id: 'realization', label: '2. Можливості' },
              { id: 'roles', label: '3. Роль учня' },
              { id: 'education', label: '4. Види освіти' },
              { id: 'importance', label: '5. Важливість' },
              { id: 'tasks', label: '6. Практикум' },
              { id: 'millionaire', label: '7. Перевірка' },
              { id: 'trajectory', label: '8. Траєкторія' }
            ].map(module => (
              <button
                key={module.id}
                onClick={() => setCurrentModule(module.id as ModuleId)}
                className={`sidebar-item ${currentModule === module.id ? 'sidebar-item-active' : ''}`}
              >
                <div className={`w-2 h-2 rounded-full ${currentModule === module.id ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                <span>{module.label}</span>
              </button>
            ))}
            
            <div className="mt-auto">
              <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10 text-center text-white">
                <p className="text-xs text-indigo-200 mb-2">Досягнення</p>
                <div className="flex justify-center -space-x-2">
                  {gameState.achievements.map((id, idx) => (
                    <div key={id} className="w-10 h-10 rounded-full border-2 border-slate-800 bg-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
                      {ACHIEVEMENTS.find(a => a.id === id)?.icon}
                    </div>
                  ))}
                  {gameState.achievements.length === 0 && <span className="text-indigo-300 text-xs">Немає досягнень</span>}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* --- Content Area --- */}
        <main className="flex-1 w-full px-4 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            {moduleRenderer()}
          </AnimatePresence>
        </main>
      </div>

      {/* --- Footer / Navigation (Small devices) --- */}
      {currentModule !== 'home' && (
        <footer className="lg:hidden glass-header border-t border-white/10 p-3 sticky bottom-0 z-40">
          <div className="flex justify-around items-center">
            <button onClick={() => setCurrentModule('home')} className="p-2 text-slate-400 hover:text-indigo-400"><Home /></button>
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Модуль</div>
              <div className="font-bold text-indigo-400 text-sm">
                {['welfare', 'realization', 'roles', 'education', 'importance', 'tasks', 'millionaire', 'trajectory'].indexOf(currentModule) + 1} / 8
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-indigo-400"><User /></button>
          </div>
        </footer>
      )}
    </div>
  );
}
