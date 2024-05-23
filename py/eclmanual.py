from langchain_community.document_loaders import PyPDFLoader
from langchain_community.llms import Ollama
from langchain.vectorstores import Chroma
from langchain.embeddings import GPT4AllEmbeddings
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_text_splitters import CharacterTextSplitter

pdf_file = '/opt/ollama-webui/py/ECLLanguageReference.pdf'
pdf_file_ashton = '/opt/ollama-webui/py/ashton_script_presentation_hpcc.pdf'

print("Loading PDF file...")
loader = PyPDFLoader(pdf_file)
data = loader.load_and_split()

print("Character splitting...")
# text_splitter = CharacterTextSplitter(chunk_size=800, chunk_overlap=200)
# all_splits = text_splitter.split_documents(data)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=100)
all_splits = text_splitter.split_documents(data)
print(f"Split into {len(all_splits)} chunks")

print("Creating vector store...")
vectorstore = Chroma.from_documents(documents=all_splits,
                                    embedding=GPT4AllEmbeddings())
print("Vector store created")

from langchain import hub
QA_CHAIN_PROMPT = hub.pull("rlm/rag-prompt-llama")

# LLM
llm = Ollama(model="llama2",
            verbose=True,
            callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]))
print(f"Loaded LLM model {llm.model}")

# QA chain
from langchain.chains import RetrievalQA
qa_chain = RetrievalQA.from_chain_type(
    llm,
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
)

# Ask a question
question = "Which functions use the OPT attribute?"
print(f"Query: {question}")
result = qa_chain({"query": question})

# print(f"\n{result}")