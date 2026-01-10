import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 表单验证
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("请填写所有字段");
      setLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      setError("用户名至少需要 2 个字符");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("请输入有效的邮箱地址");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("密码长度至少为 6 位");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      setLoading(false);
      return;
    }

    // TODO: 这里添加实际的注册 API 调用
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 注册成功后跳转到登录页面
      navigate("/login");
    } catch (err) {
      setError("注册失败，该邮箱可能已被使用");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // 密码强度检查
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "" };
    if (password.length < 6) return { strength: 1, text: "弱" };
    if (password.length < 10) return { strength: 2, text: "中" };
    return { strength: 3, text: "强" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/10 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              variants={itemVariants}
              className="flex justify-center"
            >
              <Logo size="xl" animated={true} showTitle={true} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-base">
                注册新账户，开始您的目标管理之旅
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              variants={containerVariants}
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg shadow-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.div className="space-y-2" variants={itemVariants}>
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="请输入您的用户名"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary transition-all"
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  邮箱
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="请输入您的邮箱"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary transition-all"
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="请输入密码（至少 6 位）"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary transition-all"
                  />
                </div>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          passwordStrength.strength === 1
                            ? "bg-red-500"
                            : passwordStrength.strength === 2
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <motion.span
                      className={`text-xs font-medium ${
                        passwordStrength.strength === 1
                          ? "text-red-500"
                          : passwordStrength.strength === 2
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                      animate={{
                        scale: passwordStrength.strength === 3 ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {passwordStrength.text}
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div className="space-y-2" variants={itemVariants}>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  确认密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="请再次输入密码"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="pl-10 h-11 border-gray-200 focus:border-primary focus:ring-primary transition-all"
                  />
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1 text-xs text-green-600"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </motion.div>
                    <span>密码匹配</span>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ⏳
                    </motion.span>
                  ) : (
                    <>
                      注册
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div
                className="text-center text-sm text-gray-600 pt-2"
                variants={itemVariants}
              >
                已有账户？{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-purple-600 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  立即登录
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
