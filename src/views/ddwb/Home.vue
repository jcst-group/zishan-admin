<template>
    <div class="bg">
        <img v-if="url" :src="getpic()">
    </div>
</template>
<script>
import { getBackPicName } from '@/api/ddwbApi'
import { getPlatform } from '@/api/permissonApi'
export default {
    data(){
        return{
            url:'',
        }
    },
    created(){
        
        getBackPicName().then(res=>{
            if(res.success){
                if(res.result){
                    this.url=res.result.pictureUrl;
                }
            }
        })
    },
    mounted(){
        getPlatform().then(res=>{
            if (res.success) {
                for(let i=0;i<res.result.list.length;i++){
                    if(res.result.list[i].type==2){
                        document.title=res.result.list[i].title
                        if(res.result.list[i].ico){
                            var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                            link.type = 'image/x-icon';
                            link.rel = 'shortcut icon';
                            link.href = '/api2/pictureInfo/show/'+res.result.list[i].ico.pictureUrl
                            document.getElementsByTagName('head')[0].appendChild(link);
                        }
                    }
                }
            }
        })
    },
    methods:{
        getpic(){
            return '/api2/pictureInfo/show/'+this.url;
        }
    },
}
</script>
<style scoped>
.bg{
    width: 100% ;
    height: 100% ;
    max-height: 800px ;
}
.bg img{
    width: 100% ;
    height: 100% ;
    max-height: 800px ;
}
</style>