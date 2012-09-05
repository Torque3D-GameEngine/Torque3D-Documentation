exclude_words=",a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,1,2,3,4,5,6,7,8,9,0,about,above,after,again,all,also,am,an,and,any,are,as,at,back,be,been,before,behind,being,below,but,by,can,click,do,does,done,each,else,etc,ever,every,few,for,from,generally,get,go,gone,has,have,hello,here,how,if,in,into,is,it,just,keep,later,let,like,lot,lots,made,make,makes,many,may,me,more,most,much,must,my,need,no,not,now,of,often,on,only,or,other,others,our,out,over,please,put,so,some,such,than,that,the,their,them,then,there,these,they,this,try,to,up,us,very,want,was,we,well,what,when,where,which,why,will,with,within,you,your,yourself,";

whole_word=true;
case_sensitive=false;
sort_policy=0;
search_match_policy=0;
search_section_policy=0;
search_file_policy=0;
search_within_policy=0;

target_window_target="";
set_new_win=false;
target_window_property="";

dnum=new Array(true,2,"",3,'Arial',0,'#000000',false);
dtitle=new Array(true,2,"",3,'Arial',0,'#0000FF',false);
dmtitle=new Array(2,"",3,'Arial',0,'#FF0000',true,false);
ddes=new Array(true,2,"",2,'Arial',0,'#000000',false);
dmdes=new Array(2,"",2,'Arial',0,'#FF0000',false,false);
dtext=new Array(true,2,"",2,'Arial',0,'#000000',false);
dmtext=new Array(2,"",2,'Arial',0,'#FF0000',false,true);
durl=new Array(false,2,"",2,'Arial',0,'#008000',false);
dscore=new Array(false,2,"",2,'Arial',0,'#008000',false);
ddate=new Array(false,2,"",2,'Arial',0,'#008000',false);
max_match_title=80;
max_match_des=240;
max_match_text=240;
max_match_text_before=20;

search_item_num=10;
display_newsearch=true;
display_powered=false;

search_policy=0;
url_weight=2;
title_weight=2;
keywords_weight=2;
description_weight=2;
text_weight=1;

tran_yoursearch="Your Search:";
tran_found="Found";
tran_items="Items";
tran_goback="Go Back";
tran_resultpages="Result Pages:";
tran_previous="Prev";
tran_next="Next";
url_goback="javascript:history.back();";
top_line=true;
bottom_line=true;

b_limit_result=true;
i_limit_result=500;
b_overlimit=false;

search_words="";
array_search_words=new Array();
search_words_count=0;

array_search_result=new	Array();
search_result_count=0;

array_search_text=new Array();

function trim_string(str)
{
	str=str.replace(/^\s+|\s+$/,"");
	str=str.replace(/\s{2,}/g," ");
	return str;
}

function get_search_words_array()
{
	var i_index, j_index;
	var index_word;
	var word_policy;
	var rmquo_words;
			
	rmquo_words=search_words.replace(/'|"/g,'');
	rmquo_words=rmquo_words.replace(/(\*|\?)/g,"\\S$1");
	
	//without user input AND, OR, NOT
	if (rmquo_words.search(/(\s|^)AND\s|(\s|^)OR\s|(\s|^)NOT\s/i)<0)
	{
		if (search_match_policy==2)
		{
			array_search_words[0]=new Array(rmquo_words, 0);
			search_words_count=1;			
		}
		else
		{
			rmquo_words=rmquo_words.split(' ');
			for (i_index=0;i_index<rmquo_words.length;i_index++)
				array_search_words[i_index]=new Array(rmquo_words[i_index],search_match_policy);					
			search_words_count=rmquo_words.length;
		}
	}
	else
	{			
		rmquo_words=rmquo_words.split(' ');
		
		word_policy=0;		//default policy for the first word			
		if ((rmquo_words.length>=3) && (rmquo_words[1].toUpperCase()=="OR"))	
			word_policy=1;

		search_words_count=0;		
		for (i_index=0;i_index<rmquo_words.length;i_index++)
		{			
			if (rmquo_words[i_index].toUpperCase()=="AND")
			{
				word_policy=0;
				continue;
			}
			else if (rmquo_words[i_index].toUpperCase()=="OR")
			{
				word_policy=1;
				continue;
			}
			else if (rmquo_words[i_index].toUpperCase()=="NOT")
			{
				word_policy=2;
				continue;
			};				
			array_search_words[search_words_count]=new Array(rmquo_words[i_index],word_policy);
			search_words_count++;			
		}
	}
	if (exclude_words.length>0)
	{
		j_index=0;
		for(i_index=0;i_index<search_words_count;i_index++)
		{
			index_word=","+array_search_words[i_index][0].toLowerCase()+",";
			if (exclude_words.indexOf(index_word) == -1)
			{
				array_search_words[j_index]=array_search_words[i_index];
				j_index++;
			}
		}
		search_words_count=j_index;
	}	
}

function search_file(file_index){
	
	var im_text,im_title,im_keywords,im_description,im_url;

	file_section=array_files[file_index][0];
	file_type=array_files[file_index][1];
	file_url=array_files[file_index][2];
	file_date=array_files[file_index][3];
	file_size=array_files[file_index][4];	
	file_title=array_files[file_index][5];
	file_keywords=array_files[file_index][6];
	file_description=array_files[file_index][7];
	file_text=array_files[file_index][8];
		
	match_value=0;
	
	if (search_section_policy!=0)
		if ((file_section & search_section_policy) == 0) 
			return;
			
	if (search_file_policy!=0)
		if ((file_type & search_file_policy) == 0)
			return;
		
	switch(search_within_policy)
	{
		case 4: 
			match_value=search_within_text(file_description)*description_weight;
			break;
		case 2:
			match_value=search_within_text(file_keywords)*keywords_weight;
			break;
		case 1:
			match_value=search_within_text(file_title)*title_weight;
			break;
		case 0:
			im_text=search_within_text(file_text);
			im_title=search_within_text(file_title);
			im_keywords=search_within_text(file_keywords);
			im_description=search_within_text(file_description);
			im_url=search_within_text(file_url);
			if ((im_text<0)||(im_title<0)||(im_keywords<0)||(im_description<0)||(im_url<0))
				match_value=0;
			else
				match_value=im_text*text_weight+im_title*title_weight+im_keywords*keywords_weight+im_description*description_weight+im_url*url_weight;	
	}
	
	if (match_value<=0) return;

	array_search_result[search_result_count]=new Array(file_index,match_value);
	search_result_count++;
	
}

function search_within_text(search_text)
{
	var w_index;
	var i_match,s_match,i_rst;
	var w_Regexp;
	var b_onlynot;
	
	if (search_words_count<=0) return 0;		
	if (search_text.length<=0) return 0;
		
	i_rst=0; b_onlynot=true;
	for (w_index=0;w_index<search_words_count;w_index++)
	{
		if (whole_word) w_Regexp="/(\\W|^)"+array_search_words[w_index][0]+"(\\W|$)/g";
		else w_Regexp="/"+array_search_words[w_index][0]+"/g";
		if (!case_sensitive) w_Regexp+="i";			
		switch(eval(array_search_words[w_index][1]))
		{					
			case 2: 				//NOT
				i_match=search_text.search(eval(w_Regexp));
				if (i_match>=0) return -1;	
				break;
			case 0:			//AND
				b_onlynot=false;
				s_match=search_text.match(eval(w_Regexp));
				if (s_match!=null) i_rst+=s_match.length; else return 0;
				break;
			case 1:			//OR
				b_onlynot=false;
				s_match=search_text.match(eval(w_Regexp));
				if (s_match!=null) i_rst+=s_match.length;
				break;				
		}	
	}	
	if (b_onlynot) return 1; else return i_rst;
}

function partition_bymatch(array_list,low,high)
{
	var list0,pkey;
	
	list0=array_list[low];
	pkey=array_list[low][1];
	while(low<high)
	{
		while((low<high)&&(array_list[high][1]<=pkey)) high--;
		array_list[low]=array_list[high];
		while((low<high)&&(array_list[low][1]>=pkey)) low++;
		array_list[high]=array_list[low];
	}
	array_list[low]=list0;
	return low;
}
function partition_byindex(array_list,low,high)
{
	var list0,pkey;
	
	list0=array_list[low];
	pkey=array_list[low][0];
	while(low<high)
	{
		while((low<high)&&(array_list[high][0]<=pkey)) high--;
		array_list[low]=array_list[high];
		while((low<high)&&(array_list[low][0]>=pkey)) low++;
		array_list[high]=array_list[low];
	}
	array_list[low]=list0;
	return low;
}
function qsort(array_list,low,high,b_match)
{
	var ploc;
	if (low<high)
	{
		if (b_match)
			ploc=partition_bymatch(array_list,low,high);
		else
			ploc=partition_byindex(array_list,low,high);
		qsort(array_list,low,ploc-1,b_match);
		qsort(array_list,ploc+1,high,b_match);
	}
}
function sort_search_result(sort_policy,search_policy)
{
	//by relevancy
	if (sort_policy==0)
		qsort(array_search_result,0,search_result_count-1,true);
	else if (search_policy==1)
		qsort(array_search_result,0,search_result_count-1,false);
}

function get_match_text_style_before(dmstyle)
{
	var b_style;
	switch(dmstyle[0])
	{
		case 0: 
			b_style=""; break;
		case 1:
			b_style="<span class=\""+dmstyle[1]+"\">"; break;
		case 2:
			b_style="<font ";
			if (dmstyle[6]) b_style+="style=\"BACKGROUND-COLOR: yellow\" ";
			b_style+="face=\""+dmstyle[3]+"\" color=\""+dmstyle[5]+"\" size=\""+dmstyle[2]+"\">";
			switch(dmstyle[4]){
				case 0: break;
				case 1: b_style+="<b>";	break;
				case 2:	b_style+="<i>"; break;
				case 3:	b_style+="<b><i>"; break;					
			}	
			if (dmstyle[7])
				b_style+="<u>";
			break;
	}	
	return b_style;
}

function get_match_text_style_after(dmstyle)
{
	var a_style;
	switch(dmstyle[0])
	{
		case 0: 
			a_style=""; break;
		case 1:
			a_style="</span>"; break;
		case 2:
			switch(dmstyle[4]){
				case 0: a_style=""; break;
				case 1: a_style="</b>";	break;
				case 2:	a_style="</i>";	break;
				case 3:	a_style="</i></b>"; break;					
			}	
			if (dmstyle[7])
				a_style="</u>"+a_style;
			a_style+="</font>";
			break;
	}
	return a_style;
}

function match_color_search_result(page_index)
{
	var b_title,a_title,b_des,a_des,b_text,a_text;
	var i_index,j_index,file_index,w_index,i_match,w_Regexp,i_begin;
	var file_title,file_des,file_text,result_title,result_des,result_text,str_text;
	
	b_title=""; a_title=""; b_des=""; a_des=""; b_text=""; a_text="";

	b_title=get_match_text_style_before(dmtitle);
	a_title=get_match_text_style_after(dmtitle);
	b_des=get_match_text_style_before(dmdes);
	a_des=get_match_text_style_after(dmdes);
	b_text=get_match_text_style_before(dmtext);
	a_text=get_match_text_style_after(dmtext);

	j_index=0;

	for(i_index=page_index*search_item_num;i_index<(eval(page_index)+1)*search_item_num;i_index++)
	{
		if (i_index>=search_result_count) break;
		file_index=array_search_result[i_index][0];
				

		//title
		file_title=array_files[file_index][5];
		result_title="";
		
		if (file_title.length>0)
		{		
			if (file_title.length>max_match_title)
			{
				result_title=file_title.substring(0,max_match_title);
				result_title=result_title.replace(/\s+\S*$/,"")+"...";
			}
			else
				result_title=file_title;				
			for (w_index=0;w_index<search_words_count;w_index++)
			{
				if (array_search_words[w_index][1]==2) continue;	
				if (whole_word) 
				{
					w_Regexp="/(\\W+|^)("+array_search_words[w_index][0]+")(\\W+|$)/g";
					if (!case_sensitive) w_Regexp+="i";
					result_title=result_title.replace(eval(w_Regexp),"$1"+b_title+"$2"+a_title+"$3");
				}
				else
				{
					w_Regexp="/("+array_search_words[w_index][0]+")/g";
					if (!case_sensitive) w_Regexp+="i";
					result_title=result_title.replace(eval(w_Regexp),b_title+"$1"+a_title);	
				}
			}
		}

		//des
		file_des=array_files[file_index][7];
		result_des="";
		
		if (file_des.length>0)
		{		
			if (file_des.length>max_match_des)
			{
				result_des=file_des.substring(0,max_match_des);
				result_des=result_des.replace(/\s+\S*$/,"")+"...";
			}
			else
				result_des=file_des;				
			for (w_index=0;w_index<search_words_count;w_index++)
			{
				if (array_search_words[w_index][1]==2) continue;	
				if (whole_word) 
				{
					w_Regexp="/(\\W+|^)("+array_search_words[w_index][0]+")(\\W+|$)/g";
					if (!case_sensitive) w_Regexp+="i";
					result_des=result_des.replace(eval(w_Regexp),"$1"+b_des+"$2"+a_des+"$3");
				}
				else
				{
					w_Regexp="/("+array_search_words[w_index][0]+")/g";
					if (!case_sensitive) w_Regexp+="i";
					result_des=result_des.replace(eval(w_Regexp),b_des+"$1"+a_des);	
				}
			}
		}

		//text
		file_text=array_files[file_index][8];
		result_text="";
		
		if (file_text.length>0)
		{
			for (w_index=0;w_index<search_words_count;w_index++)
			{
				if (array_search_words[w_index][1]==2) continue;			
				if (whole_word) 
					w_Regexp="/(\\W+|^)("+array_search_words[w_index][0]+")(\\W+|$)/g";
				else 
					w_Regexp="/("+array_search_words[w_index][0]+")/g";
				if (!case_sensitive) w_Regexp+="i";						
				i_match=file_text.search(eval(w_Regexp)); if (i_match<0) continue;						
				i_begin=(i_match>max_match_text_before)?(i_match-max_match_text_before):0;
				i_length=file_text.length;
				i_end=(i_length>(i_begin+max_match_text))?(i_begin+max_match_text):i_length;				
				str_text=file_text.substring(i_begin,i_end-1);
				if (i_begin>0)
					str_text="..."+str_text.replace(/^\S*\s+/,"");
				if (i_end<i_length)
					str_text=str_text.replace(/\s+\S*$/,"")+"...";		
							
				result_text+=str_text;
			}

			for (w_index=0;w_index<search_words_count;w_index++)
			{
				if (array_search_words[w_index][1]==2) continue;			
				if (whole_word) 
					w_Regexp="/(\\W+|^)("+array_search_words[w_index][0]+")(\\W+|$)/g";
				else 
					w_Regexp="/("+array_search_words[w_index][0]+")/g";
				if (!case_sensitive) w_Regexp+="i";						

				if (whole_word)
					result_text=result_text.replace(eval(w_Regexp),"$1"+b_text+"$2"+a_text+"$3");
				else
					result_text=result_text.replace(eval(w_Regexp),b_text+"$1"+a_text);	
			}
		}

		//array
		array_search_text[j_index]=new Array(array_search_result[i_index][1],array_files[file_index][1],array_files[file_index][2],array_files[file_index][3],array_files[file_index][4],result_title,result_des,result_text);
		j_index++;			
	}
}

function get_text_style_before(dstyle)
{
	var b_style;
	switch(dstyle[1])
	{
		case 0:
			b_style=""; 
			break;
		case 1:
			b_style="<span class=\""+dstyle[2]+"\">";	
			break;
		case 2:
			b_style="<font face=\""+dstyle[4]+"\" color=\""+dstyle[6]+"\" size=\""+dstyle[3]+"\">";
			switch(dstyle[5])
			{
				case 0:
					break;
				case 1:
					b_style+="<b>";	break;
				case 2:
					b_style+="<i>"; break;
				case 3:
					b_style+="<b><i>"; break;
			}
			if (dstyle[7])
				b_style+="<u>";
			break;
	}	
	return b_style;
}

function get_text_style_after(dstyle)
{
	var a_style;
	switch(dstyle[1])
	{
		case 0:
			a_style="";
			break;
		case 1:
			a_style="</span>";
			break;
		case 2:
			switch(dstyle[5])
			{
				case 0:
					a_style=""; break;
				case 1:
					a_style="</b>"; break;
				case 2:
					a_style="</i>"; break;
				case 3:
					a_style="</i></b>"; break;
			}
			if (dstyle[7])
				a_style="</u>"+a_style;
			a_style+="</font>";
			break;
	}	
	return a_style;
}

function get_output_search_result(page_index)
{
	var b_num,a_num,b_title,a_title,b_des,a_des,b_text,a_text,b_url,a_url,b_date,a_date;
	var item_index,j_index;
	var page_num,page_num_index;
	var output_string;
	var min_item,max_item;
	var newsearch_string,powered_string;	
	var min_num,max_num;
	var self_url,param_index;
	
	b_num=""; a_num=""; b_title=""; a_title=""; b_des=""; a_des=""; b_text=""; a_text=""; 
	b_url=""; a_url=""; b_score=""; a_score=""; b_date=""; a_date="";

	b_num=get_text_style_before(dnum);
	a_num=get_text_style_after(dnum);
	b_title=get_text_style_before(dtitle);
	a_title=get_text_style_after(dtitle);
	b_des=get_text_style_before(ddes);
	a_des=get_text_style_after(ddes);
	b_text=get_text_style_before(dtext);
	a_text=get_text_style_after(dtext);
	b_url=get_text_style_before(durl);
	a_url=get_text_style_after(durl);
	b_score=get_text_style_before(dscore);
	a_score=get_text_style_after(dscore);
	b_date=get_text_style_before(ddate);
	a_date=get_text_style_after(ddate);

	newsearch_string="";
	if (display_newsearch) 
		newsearch_string="&nbsp;&nbsp;&nbsp;&nbsp;<a href=\""+url_goback+"\">"+tran_goback+"</a>&nbsp;";
		
	powered_string="";
	if (display_powered)
		powered_string="Powered By <a href='http://www.mtopsoft.com/sitesearch/index.htm'>Search Engine Composer</a>.";
	
	min_item=eval(eval(page_index*search_item_num)+1);
	max_item=(((eval(page_index)+1)*search_item_num)>search_result_count)?search_result_count:((eval(page_index)+1)*search_item_num);	
	output_string="<p>"+b_text+tran_yoursearch+"&nbsp;<b>"+search_words+"</b>,&nbsp;"+tran_found+"&nbsp;<b>";	
	if (b_limit_result && b_overlimit)
		output_string+=">"+i_limit_result;
	else
		output_string+=search_result_count;		
	output_string+="</b>&nbsp;"+tran_items+"."+newsearch_string+a_text;
	if (top_line)
		output_string+="<hr>";
	output_string+="</p>";		
	
	if (search_result_count>0)
	{ 		
		for (item_index=0;item_index<search_item_num;item_index++)
		{
			if ((page_index*search_item_num+item_index)>=search_result_count) 
				break;
				
			output_string+="<p>";
			if (dnum[0])
				output_string+=b_num+eval(eval(page_index)*search_item_num+item_index+1)+"."+a_num;
			
			if (dtitle[7])
				output_string+="<a style=\"text-decoration:underline\" ";
			else
				output_string+="<a style=\"text-decoration:none\" ";
			if (set_new_win)
				output_string+="href=javascript:resultwin=window.open(\""+array_search_text[item_index][2]+"\",\""+target_window_target+"\",\""+target_window_property+"\");resultwin.focus();>";
			else
			{
				output_string+="href=\""+array_search_text[item_index][2]+"\"";
				if (target_window_target!="")
					output_string+=" target="+target_window_target;
				output_string+=">";
			}
			output_string+=b_title;
			if ((dtitle[0])&&(array_search_text[item_index][5].length>0))
				output_string+=array_search_text[item_index][5];	
			else
				output_string+=array_search_text[item_index][2];
			output_string+=a_title+"</a>";
			
			if ((array_search_text[item_index][6].length>0)&&(ddes[0]))
				output_string+="<br>"+b_des+array_search_text[item_index][6]+a_des;

			if ((array_search_text[item_index][7].length>0)&&(dtext[0]))
				output_string+="<br>"+b_text+array_search_text[item_index][7]+a_text;

			if (durl[0] || dscore[0] || ddate[0])
				output_string+="<br>";

			if (durl[0])
				output_string+=b_url+"URL:"+array_search_text[item_index][2]+"  "+a_url;			

			if (dscore[0])
				output_string+=b_score+"Score:"+array_search_text[item_index][0]+"  "+a_score;

			if (ddate[0])
				output_string+=b_date+"Date:"+array_search_text[item_index][3]+"  Size:"+array_search_text[item_index][4]+a_date;
			
			output_string+="</p>";
		}	

		page_num=search_result_count/search_item_num;
		output_string+="<p>"
		if (bottom_line)
			output_string+="<hr>";
		output_string+=b_text;
		
		self_url = document.location.href;
		param_index = self_url.indexOf("?");    
		if (param_index > -1) self_url = self_url.substr(0, param_index);
		param_index = self_url.indexOf("#");
		if (param_index > -1) self_url = self_url.substr(0, param_index); 		
		
		href_string=self_url+"?sw="+encodeURIComponent(search_words)+"&ss="+search_section_policy+"&sin="+search_within_policy+"&sm="+search_match_policy+"&ssort="+sort_policy+"&sf="+search_file_policy;
		output_string+=tran_resultpages+"&nbsp;&nbsp;";
		if (page_index>0)
			output_string+="<a href="+href_string+"&page="+eval(eval(page_index)-1)+">"+tran_previous+"</a>&nbsp;&nbsp;"	
		
		min_num=(page_index>=5)?(eval(eval(page_index)-5)):0;
		max_num=(page_index<eval(eval(page_num)-5))?(eval(eval(page_index)+5)):page_num;
			
		for(page_num_index=min_num;page_num_index<max_num;page_num_index++)
		{
			if (page_num_index!=page_index) 
				output_string+="<a href="+href_string+"&page="+page_num_index+">"+eval(eval(page_num_index)+1)+"</a>&nbsp;&nbsp;";
			else 
				output_string+=eval(eval(page_num_index)+1)+"&nbsp;&nbsp;";
		}
		if (page_index<eval(page_num-1))
			output_string+="<a href="+href_string+"&page="+eval(eval(page_index)+1)+">"+tran_next+"</a>&nbsp;&nbsp;";
		output_string+=a_text+"</p>";
	}
	
	if (display_powered)
		output_string+="<p>"+b_text+powered_string+a_text+"</p>";
	return output_string;
}

function hash_str(str)
{
	var n_hash;
	var i;

	n_hash=0;
	for (i=0;i<str.length;i++)
	{
		n_hash = (n_hash<<5) + str.charCodeAt(i);
		if ((!case_sensitive) && (str.charCodeAt(i)>=65) && (str.charCodeAt(i)<=90))
			n_hash += 32;
	}
	return Math.abs(n_hash % 87719);
}

//directly return result
function simple_search_dict(str)
{
	var w_Regexp;
	var id,k,m;
	var i_match, i_hash;

	i_hash=hash_str(str);
	if (ws[i_hash]==null)
	{
		array_search_result=null;
		search_result_count=0;
		return;
	}
	i_match=-1;
	w_Regexp="/^"+str+"( |$)/";
	if (!case_sensitive) w_Regexp+="i";
	for (id=0;id<ws[i_hash].length;id++)
	{
		i_match=ws[i_hash][id][0].search(eval(w_Regexp));
		if ((i_match>=0))
			break;
	}
	if (i_match<0)
	{
		array_search_result=null;
		search_result_count=0;
		return;
	}
	m=0;
	for (k=0;k<(ws[i_hash][id].length-1)/2;k++)
	{
		if ((search_section_policy==0) || ((array_files[ws[i_hash][id][k*2+1]][0] & search_section_policy) != 0))
		{
			array_search_result[m++]=new Array(ws[i_hash][id][k*2+1],ws[i_hash][id][k*2+2]);
			if ((b_limit_result) && (m>i_limit_result))
			{
				b_overlimit=true;
				break;
			}
		}
	}
	search_result_count=m;
	return;
}

//return a new hash table
function search_dict(str)
{
	var w_Regexp;
	var id,k,m;
	var i_match,i_hash;
	var hash_t;

	var i_h1,id;

	hash_t=null;
	i_match=-1;
	if (whole_word)
		w_Regexp= "/^"+str+"( |$)/";
	else
		w_Regexp="/"+str+"/";
	if (!case_sensitive) w_Regexp+="i";
	if ((str.search(/(\*|\?)/g) < 0) && whole_word)
	{
		i_h1=hash_str(str);
		if (ws[i_h1]==null)
			return null;
		else
		{
			for(id=0;id<ws[i_h1].length;id++)
			{
				i_match=ws[i_h1][id][0].search(eval(w_Regexp));
				if (i_match>=0)
				{					
					for (k=0;k<(ws[i_h1][id].length-1)/2;k++)
					{
						if ((search_section_policy==0) || ((array_files[ws[i_h1][id][k*2+1]][0] & search_section_policy) != 0))
						{
							if (hash_t==null)
							hash_t=new Array(673);
							i_hash = ws[i_h1][id][k*2+1] % 673;
							if (hash_t[i_hash]==null)
									hash_t[i_hash]=new Array(ws[i_h1][id][k*2+1],ws[i_h1][id][k*2+2]);
							else
							{
								for (m=0;m<hash_t[i_hash].length/2;m++)
								{
									if (hash_t[i_hash][m*2]==ws[i_h1][id][k*2+1])
										hash_t[i_hash][m*2+1]+=ws[i_h1][id][k*2+2];
									else
											hash_t[i_hash].push(ws[i_h1][id][k*2+1],ws[i_h1][id][k*2+2]);
								}
							}
						}
					}
					break;
				}
			}
		}
	}
	else
	{
		for (i=0;i<ws.length;i++)
		{
			if (ws[i]==null)
				continue;
			for (id=0;id<ws[i].length;id++)
			{
				i_match=ws[i][id][0].search(eval(w_Regexp));
				if (i_match>=0)
				{					
					for (k=0;k<(ws[i][id].length-1)/2;k++)
					{
						if ((search_section_policy==0) || ((array_files[ws[i][id][k*2+1]][0] & search_section_policy) != 0))
						{
							if (hash_t==null)
							hash_t=new Array(673);
							i_hash = ws[i][id][k*2+1] % 673;
							if (hash_t[i_hash]==null)
								hash_t[i_hash]=new Array(ws[i][id][k*2+1],ws[i][id][k*2+2]);
							else
							{
								for (m=0;m<hash_t[i_hash].length/2;m++)
								{
									if (hash_t[i_hash][m*2]==ws[i][id][k*2+1])
										hash_t[i_hash][m*2+1]+=ws[i][id][k*2+2];
									else
										hash_t[i_hash].push(ws[i][id][k*2+1],ws[i][id][k*2+2]);
								}
							}
						}
					}
				}
			}
		}
	}
	return hash_t;
}

function or_hash_table(hash_old,hash_n)
{
	var i,m,p;
	var i_oldlen;
	var b_matched;

	if ((hash_old==null) && (hash_n==null)) return null;
	if (hash_old==null) return hash_n;
	if (hash_n==null) return hash_old;


	for(i=0;i<673;i++)
	{
		if (hash_n[i]==null)
			continue;
		else if (hash_old[i]==null)
			hash_old[i]=hash_n[i]; 
		else
		{
			i_oldlen=hash_old[i].length/2;
			for (m=0;m<hash_n[i].length/2;m++)
			{
				b_matched=false;
				for (p=0;p<i_oldlen;p++)
				{
					if (hash_n[i][m*2]==hash_old[i][p*2])
					{
						hash_old[i][p*2+1]+=hash_n[i][m*2+1];
						b_matched=true;
						break;
					}						
				}
				if (!b_matched) 
					hash_old[i].push(hash_n[i][m*2],hash_n[i][m*2+1]);
			}
		}
	}
	return hash_old;
}

function and_hash_table(hash_old,hash_n)
{
	var i,m,p;
	var hash_rst;

	if ((hash_old==null) || (hash_n==null)) return null;

	hash_rst=new Array(673);
	for(i=0;i<673;i++)
	{
		if ((hash_n[i]==null) || (hash_old[i]==null))
			continue;
		else
		{
			for (m=0;m<hash_n[i].length/2;m++)
			{
				for (p=0;p<hash_old[i].length/2;p++)
				{
					if (hash_n[i][m*2]==hash_old[i][p*2])
					{
						if (hash_rst[i]==null)
							hash_rst[i]=new Array(hash_n[i][m*2],hash_old[i][p*2+1]+hash_n[i][m*2+1]);
						else
							hash_rst[i].push(hash_n[i][m*2],hash_old[i][p*2+1]+hash_n[i][m*2+1]);
						break;
					}
				}
			}
		}
	}
	return hash_rst;
}

function get_table_from_hash(hash_t)
{
	var i,m,k;
	var list_t;

	if (hash_t==null) return null;

	list_t=new Array();
	k=0;
	for (i=0;i<673;i++)
	{
		if (b_limit_result && (k>i_limit_result))
		{
			b_overlimit=true;
			break;
		}
		if (hash_t[i]==null)
			continue;
		else
		{
			for (m=0;m<hash_t[i].length/2;m++)
			{
				list_t[k]=new Array(hash_t[i][m*2],hash_t[i][m*2+1]);
				k++;
			}
		}
	}
	return list_t;

}

//return last result
function merge_with_not(list_t,hash_not,b_onlynot)
{
	var list_new;
	var i,i_hash,k,m;

	if ((list_t==null) && (!b_onlynot)) return null;

	if ((hash_not==null) && (list_t!=null)) return list_t;

	list_new=new Array();
	k=0;	
	if ((hash_not==null) && (list_t==null))
	{
		for (i=0;i<file_count;i++)
		{
			if ((search_section_policy==0) || ((array_files[i][0] & search_section_policy) != 0))
			{
				list_new[k++]=new Array(i,1);
				if (b_limit_result && (k>i_limit_result))
				{
					b_overlimit=true;
					break;
				}
			}
		}
	}
	else if (list_t==null)
	{
		for (i=0;i<file_count;i++)
		{
			if ((search_section_policy==0) || ((array_files[i][0] & search_section_policy) != 0))
			{
				i_hash=i % 673;
				if (hash_not[i_hash]==null)
					list_new[k++]=new Array(i,1);
				else
				{
					for (m=0;m<hash_not[i_hash].length/2;m++)
					{
						if (i==hash_not[i_hash][m*2])
							break;
					}
					if (m>=hash_not[i_hash].length/2)
						list_new[k++]=new Array(i,1);
				}
				if (b_limit_result && (k>i_limit_result))
				{
					b_overlimit=true;
					break;
				}
			}
		}
	}
	else
	{
		for (i=0;i<list_t.length;i++)
		{
			if ((search_section_policy==0) || ((array_files[list_t[i][0]][0] & search_section_policy) != 0))
			{
				i_hash=list_t[i][0] % 673;
				if (hash_not[i_hash]==null)
					list_new[k++]=new Array(list_t[i][0],list_t[i][1]);
				else
				{
					for (m=0;m<hash_not[i_hash].length/2;m++)
					{
						if (list_t[i][0]==hash_not[i_hash][m*2])
							break;
					}
					if (m>=hash_not[i_hash].length/2)
						list_new[k++]=new Array(list_t[i][0],list_t[i][1]);
				}
				if (b_limit_result && (k>i_limit_result))
				{
					b_overlimit=true;
					break;
				}
			}
		}
	}
	return list_new;
}

function search_index()
{
	var hash_t,hash_not,hash_new;
	var list_t;
	var i_match;
	var b_onlynot;
	

	hash_t = null;
	hash_not = null;
	
	if (search_words_count<=0)
		return;

	//for most cases
	if ((search_words_count==1) && (eval(array_search_words[0][1])!=2) && whole_word)
	{
		if (array_search_words[0][0].search(/(\*|\?)/g) < 0)
		{
			simple_search_dict(array_search_words[0][0]);
			return;
		}
	}

	//do search
	b_onlynot=true;
	for (w_index=0;w_index<search_words_count;w_index++)
	{
		if (eval(array_search_words[w_index][1])!=2) b_onlynot=false;
		hash_new=search_dict(array_search_words[w_index][0]);
		if (hash_new == null)
		{
			if (eval(array_search_words[w_index][1])==0)
			{
				hash_t = null;
				break;
			}
		}
		else
		{
			switch(eval(array_search_words[w_index][1]))
			{					
				case 2: 				//NOT
					if (hash_not==null)
						hash_not=hash_new;
					else
						hash_not=or_hash_table(hash_not,hash_new);
					break;
				case 0:			//AND
					if (hash_t==null)
						hash_t=hash_new;
					else
						hash_t=and_hash_table(hash_t,hash_new);
					break;
				case 1:			//OR
					if (hash_t==null)
						hash_t=hash_new;
					else
						hash_t=or_hash_table(hash_t,hash_new);
					break;				
			}
		}
	}
	if (hash_t!=null)
		list_t = get_table_from_hash(hash_t);
	else
		list_t = null;

	array_search_result = merge_with_not(list_t,hash_not,b_onlynot);
	if (array_search_result==null)
		search_result_count=0;
	else
		search_result_count=array_search_result.length;
}


function search_engine(search_policy)
{

	if (search_policy==0)
		for(file_index=0;file_index<file_count;file_index++) 
		{
			search_file(file_index); 
			if ((b_limit_result) && (search_result_count>i_limit_result))
			{
				b_overlimit=true;
				break;
			}
		}
	else
		search_index();

}

function auto_run_search()
{
	var str_param;
	var param_arg;
	var iParam;
	var sf_policy,ss_policy,sin_policy;
	

	str_param=document.location.search;
	if (str_param=="") return;
	
	if(str_param.charAt(0)=="?") str_param=str_param.substring(1,str_param.length);	
	param_arg=str_param.split("&");	
		
	search_words=""; page_index=0; sf_policy=0; ss_policy=0; sin_policy=0;
	for(iParam=0;iParam<param_arg.length;iParam++) 
	{
		param_arg_values=param_arg[iParam].split("=");
		param_name=unescape(param_arg_values[0]);	

		switch (param_name)
		{
		case "sw":
			search_words=decodeURIComponent(param_arg_values[1]);
			break;
		case "sm":
			search_match_policy=param_arg_values[1];
			break;
		case "ssort":
			sort_policy=param_arg_values[1];	
			break;
		case "page":
			page_index=param_arg_values[1];				
			break;
		case "sf":
			sf_policy+=eval(param_arg_values[1]);		
			search_file_policy=sf_policy;
			break;
		case "ss":
			ss_policy+=eval(param_arg_values[1]);	
			search_section_policy=ss_policy;
			break;
		case "sin":
			sin_policy+=eval(param_arg_values[1]);
			search_within_policy=sin_policy;
			break;
		}
	}
		
	search_words=search_words.replace(/\+/g, " ");
	search_words=trim_string(search_words);
	if (search_words=="") return; 
	

	get_search_words_array();	
	search_engine(search_policy);			
	sort_search_result(sort_policy,search_policy); 	
		
	match_color_search_result(page_index); 	
	document.write(get_output_search_result(page_index));
}


auto_run_search();