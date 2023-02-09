<template>
    <div class="bg-no-repeat bg-cover bg-center relative"
        style="background-image: url(https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8);">
        <div class="absolute bg-gradient-to-b from-slate-500 to-slate-400 opacity-75 inset-0 z-0"></div>
        <div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
            <div class="flex justify-center self-center  z-10">
                <div class="p-12 bg-white mx-auto rounded-2xl w-100 ">
                    <div class="mb-4">
                        <h3 class="font-semibold text-2xl text-gray-800"> Forgot your password? </h3>
                        <p class="text-gray-500">Enter the email address associated with your account</p>
                        <p class="text-gray-500">and we’ll send you a link to reset your password.</p>
                    </div>
                    <div class="space-y-5">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                            <input
                                class=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-slate-400"
                                type="" placeholder="mail@gmail.com">
                        </div>
                        <div>
                            <button type="submit"
                                class="w-full flex justify-center bg-cyan-400  hover:bg-cyan-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                                Reset Password
                            </button>
                        </div>
                    </div>
                    <div class="pt-5 text-center text-sky-800 text-xs">
                        <span>
                            Copyright © 2022-2023</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>