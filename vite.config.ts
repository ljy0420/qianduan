import vue from '@vitejs/plugin-vue';
import path from 'path';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const pathSrc = path.resolve(__dirname, 'src'); // 定义 src 路径

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());

  return {
    // 路径别名
    resolve: {
      alias: {
        '@': pathSrc, // 将 @ 映射到 src 目录
      },
    },
    define: {
      __DEFINES__: JSON.stringify({
        apiUrl: env.VITE_BASE_API,
        port: env.VITE_PORT,
        title: env.VITE_TITLE,
      }),
    },
    server: {
      // host: '0.0.0.0',
      // port: Number(env.VITE_PORT),
      // open: true, //运行是否自动打开浏览器
      // //反向代理解决跨域
      // proxy: {
      //   [env.VITE_BASE_API]: {
      //     target: 'http://vapi.youlai.tech',
      //     changeOrigin: true,
      //     rewrite: (path) =>
      //       //eg: localhost:3000/dev-api/users/me -> http://vapi.youlai.tech/users/me
      //       path.replace(new RegExp('^' + env.VITE_BASE_API), ''),
      //   },
      // },
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        //define global scss variable
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variables.scss" as *;`,
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],
        eslintrc: {
          enabled: true, // 是否自动生成 eslint 规则，建议生成之后设置 false
          filepath: './.eslintrc-auto-import.json', // 指定自动导入函数 eslint 规则的文件
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({}),
        ],
        vueTemplate: true, // 是否在 vue 模板中自动导入
        dts: path.resolve(pathSrc, 'types', 'auto-imports.d.ts'), // 自动导入组件类型声明文件位置，默认根目录
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'], // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
          }),
        ],
        dts: path.resolve(pathSrc, 'types', 'components.d.ts'), //  自动导入组件类型声明文件位置，默认根目录
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true,
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  };
};
