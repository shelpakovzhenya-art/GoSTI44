<x-filament-panels::page>
    <div class="visual-editor" x-data="{
        mobile: false, ready: false,
        send(key, value) {
            this.$refs.preview?.contentWindow?.postMessage({type: 'cms:change', key, value}, $wire.previewOrigin);
        },
        receive(event) {
            if (event.origin !== $wire.previewOrigin || event.source !== this.$refs.preview?.contentWindow) return;
            if (event.data?.type === 'cms:ready') this.ready = true;
            if (event.data?.type === 'cms:select' && typeof event.data.key === 'string') $wire.selectText(event.data.key);
        }
    }" x-on:message.window="receive($event)"
        x-on:visual-text.window="send($event.detail.key, $event.detail.value); if (window.innerWidth < 1000) $el.querySelector('.ve-panel').scrollIntoView({block:'start'})"
        x-on:beforeunload.window="if ($wire.value !== $wire.savedValue) { $event.preventDefault(); $event.returnValue = ''; }">
        <style>
            .visual-editor { display:grid; grid-template-columns:minmax(0,1fr) 310px; gap:20px; align-items:start }
            .ve-canvas { min-width:0; border:1px solid #c9c9c3; border-radius:12px; overflow:hidden; background:#e8e6e0 }
            .ve-toolbar { display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding:12px; background:#fbfaf7; color:#263b30 }
            .ve-toolbar button { padding:6px 10px; border:1px solid #b4b9af; border-radius:6px }
            .ve-toolbar button[aria-pressed=true] { background:#263b30; color:white }
            .ve-frame { display:block; height:75vh; width:100%; margin:auto; background:white; border:0 }
            .ve-panel { padding:18px; border:1px solid #c9c9c3; border-radius:12px; background:var(--gray-50,#fbfaf7); color:#263b30 }
            .ve-panel label,.ve-panel h2 { display:block; font-weight:650; margin-bottom:10px }
            .ve-panel textarea,.ve-panel select { width:100%; color:#263b30; background:white; border:1px solid #929d91; border-radius:8px; padding:10px }
            .ve-panel textarea { min-height:160px; margin:10px 0; resize:vertical }
            .ve-panel p { font-size:13px; line-height:1.5; margin:12px 0 }
            .ve-actions { display:grid; gap:10px; margin-top:14px }
            .ve-error { color:#b42318; font-weight:600 }
            .ve-status { font-size:12px; margin-left:auto }
            @media(max-width:1000px){ .visual-editor{grid-template-columns:1fr}.ve-panel{grid-row:1}.ve-frame{height:65vh} }
        </style>
        <div class="ve-canvas">
            <div class="ve-toolbar">
                <button type="button" x-on:click="mobile=false" x-bind:aria-pressed="!mobile">Компьютер</button>
                <button type="button" x-on:click="mobile=true" x-bind:aria-pressed="mobile">Телефон</button>
                <button type="button" wire:click="refreshPreview" wire:confirm="Предпросмотр загрузит сохранённые черновики. Обновить?">Обновить просмотр</button>
                <span class="ve-status" x-text="ready ? 'Нажмите на текст в пунктирной рамке' : 'Загрузка… Если ссылка истекла, обновите просмотр.'"></span>
            </div>
            <iframe wire:key="{{ hash('sha256', $previewUrl) }}" x-ref="preview" class="ve-frame"
                x-bind:style="mobile ? 'max-width:390px' : ''" src="{{ $previewUrl }}"
                title="Главная страница — визуальный выбор текста" referrerpolicy="no-referrer"></iframe>
        </div>
        <aside class="ve-panel">
            <h2>Текст на странице</h2>
            <p>Нажмите на нужную фразу в предпросмотре или выберите её здесь. Правка сразу видна в просмотре.</p>
            <label for="ve-text-list">Найти текст</label>
            <select id="ve-text-list" wire:change="selectText($event.target.value)">
                <option value="" disabled @selected(!$selectedKey)>Выберите фразу</option>
                @foreach(\App\Support\VisualEditorContent::catalog() as $field)
                    <option value="{{ $field['key'] }}" @selected($selectedKey === $field['key'])>{{ $field['label'] }} · {{ \Illuminate\Support\Str::limit($field['value'], 65) }}</option>
                @endforeach
            </select>
            @if($selectedKey)
                <div wire:key="field-{{ $selectedKey }}">
                    <label for="ve-value" style="margin-top:18px">Новый текст</label>
                    <textarea id="ve-value" wire:model="value" x-on:input="send($wire.selectedKey, $event.target.value)"></textarea>
                    @error('value') <p role="alert" class="ve-error">{{ $message }}</p> @enderror
                    <p x-text="$wire.value !== $wire.savedValue ? 'Есть несохранённые изменения' : 'Показан сохранённый черновик'"></p>
                    <div class="ve-actions">
                        <x-filament::button wire:click="saveDraft" wire:loading.attr="disabled">Сохранить черновик</x-filament::button>
                        <x-filament::button color="gray" wire:click="discard">Отменить правку</x-filament::button>
                        @if(auth()->user()->canPublish())
                            <x-filament::button color="success" wire:click="publishSelected" wire:loading.attr="disabled"
                                wire:confirm="Опубликовать все сохранённые изменения выбранного блока на сайте?">Опубликовать блок</x-filament::button>
                        @endif
                    </div>
                    <p>Публикуется весь выбранный блок, включая его ранее сохранённые изменения. История версий доступна в обычной форме блока.</p>
                </div>
            @else
                @error('value') <p role="alert" class="ve-error">{{ $message }}</p> @enderror
                <p>Посетители сайта видят только опубликованную версию.</p>
            @endif
            <p><a href="{{ \App\Filament\Resources\ContentEntries\ContentEntryResource::getUrl() }}" style="text-decoration:underline">Контент, фотографии и история версий →</a></p>
        </aside>
    </div>
</x-filament-panels::page>
